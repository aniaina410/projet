import pandas as pd

from rest_framework import viewsets, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Role, Direction, Service, Utilisateur,
    LogAction, ValeurExtrait, Valeur,
    HistoriqueValeur, Validation
)

from .serializers import (
    LoginSerializer,ChangeLoginSerializer,CreateUserSerializer,
    RoleSerializer, DirectionSerializer, ServiceSerializer,
    UtilisateurSerializer, ChangePasswordSerializer,
    LogActionSerializer, ValeurExtraitSerializer,
    ValeurSerializer, HistoriqueValeurSerializer,
    ValidationSerializer
)

from .permissions import IsAdmin

# =====================================================
# AUTHENTIFICATION
# =====================================================
class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id_utilisateur,
                "login": user.login,
                "is_staff": user.is_staff,
            }
        })


# =====================================================
# UTILISATEUR
# =====================================================
class UtilisateurViewSet(viewsets.ModelViewSet):
    serializer_class = CreateUserSerializer
    queryset = Utilisateur.objects.all().order_by("id_utilisateur")
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ["nom_utilisateur", "prenom_utilisateur", "login", "mail"]
    filterset_fields = ["id_role", "id_service", "is_active"]

    # =========================
    # SERIALIZER PAR ACTION
    # =========================
    def get_serializer_class(self):
        if self.action == "create":
            return CreateUserSerializer
        if self.action == "change_password":
            return ChangePasswordSerializer
        if self.action == "change_login":
            return ChangeLoginSerializer
        return UtilisateurSerializer

    # =========================
    # PERMISSIONS PAR ACTION
    # =========================
    def get_permissions(self):
        if self.action in ["me", "change_password", "change_login"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

    # =========================
    # PROFIL UTILISATEUR CONNECTÉ
    # =========================
    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = UtilisateurSerializer(request.user)
        return Response(serializer.data)

    # =========================
    # CHANGEMENT MOT DE PASSE
    # =========================
    @action(detail=True, methods=["post"], url_path="change_password")
    def change_password(self, request, pk=None):
        user = self.get_object()

        # 🔒 sécurité : seul l'utilisateur lui-même
        if request.user.id_utilisateur != user.id_utilisateur:
            return Response(
                {"detail": "Action non autorisée"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"detail": "Mot de passe actuel incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response({"detail": "Mot de passe modifié avec succès"})

    # =========================
    # CHANGEMENT LOGIN
    # =========================
    @action(detail=True, methods=["post"], url_path="change_login")
    def change_login(self, request, pk=None):
        user = self.get_object()

        # 🔒 sécurité : seul l'utilisateur lui-même
        if request.user.id_utilisateur != user.id_utilisateur:
            return Response(
                {"detail": "Action non autorisée"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ChangeLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user.login = serializer.validated_data["new_login"]
        user.save()

        return Response({"detail": "Login modifié avec succès"})


# =====================================================
# VALEUR
# =====================================================
class ValeurViewSet(ModelViewSet):
    queryset = Valeur.objects.all()
    serializer_class = ValeurSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Valeur.objects.all().order_by("-id_valeur")
        return Valeur.objects.filter(id_utilisateur=user).order_by("-id_valeur")

    def perform_create(self, serializer):
        serializer.save(
            id_utilisateur=self.request.user,
            status="MANUELLE"
        )

    # -----------------------------
    # IMPORT EXCEL
    # -----------------------------
    @action(detail=False, methods=["post"], url_path="import-excel")
    def import_excel(self, request):
        if "file" not in request.FILES:
            return Response({"detail": "Aucun fichier fourni"}, status=400)

        try:
            df = pd.read_excel(request.FILES["file"])
        except Exception:
            return Response({"detail": "Fichier Excel invalide"}, status=400)

        created = 0
        errors = []

        for index, row in df.iterrows():
            data = row.to_dict()

            # Nettoyage NaN / vides
            for key, value in data.items():
                if pd.isna(value) or value == "":
                    data[key] = None

            serializer = ValeurSerializer(data=data)
            if serializer.is_valid():
                serializer.save(
                    id_utilisateur=request.user,
                    status="IMPORTEE",
                    id_extraction=None
                )
                created += 1
            else:
                errors.append({
                    "ligne": index + 2,
                    "erreurs": serializer.errors
                })

        return Response({
            "created": created,
            "errors_count": len(errors),
            "errors": errors
        })


# =====================================================
# AUTRES VIEWSETS
# =====================================================
class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]


class DirectionViewSet(ModelViewSet):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [IsAuthenticated]


class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]


class LogActionViewSet(ModelViewSet):
    queryset = LogAction.objects.all()
    serializer_class = LogActionSerializer
    permission_classes = [IsAuthenticated]


class ValeurExtraitViewSet(ModelViewSet):
    queryset = ValeurExtrait.objects.all()
    serializer_class = ValeurExtraitSerializer
    permission_classes = [IsAuthenticated]


class HistoriqueValeurViewSet(ModelViewSet):
    queryset = HistoriqueValeur.objects.all()
    serializer_class = HistoriqueValeurSerializer
    permission_classes = [IsAuthenticated]


class ValidationViewSet(ModelViewSet):
    queryset = Validation.objects.all()
    serializer_class = ValidationSerializer
    permission_classes = [IsAuthenticated]
