from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsAdmin

from .models import (
    Role, Direction, Service, Utilisateur,
    LogAction, ValeurExtrait, Valeur,
    HistoriqueValeur, Validation
)

from .serializers import (
    RoleSerializer, DirectionSerializer, ServiceSerializer, UtilisateurSerializer,
    LogActionSerializer, ValeurExtraitSerializer, ValeurSerializer,
    HistoriqueValeurSerializer, ValidationSerializer, ChangePasswordSerializer, CreateUserSerializer
)



class BaseViewSet(viewsets.ModelViewSet):
    """ViewSet de base avec authentification obligatoire."""
    permission_classes = [IsAuthenticated]



class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all().order_by('id_role')
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated & IsAdmin]
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['role_nom']
    filterset_fields = ['role_nom']
    
    def destroy(self, request, *args, **kwargs):
        role = self.get_object()
        if Utilisateur.objects.filter(id_role=role).exists():
            return Response(
                {"detail": "Impossible de supprimer un rôle déjà utilisé."},
                status=400
            )
        return super().destroy(request, *args, **kwargs)

class DirectionViewSet(BaseViewSet):
    queryset = Direction.objects.all().order_by('id_direction')
    serializer_class = DirectionSerializer
    permission_classes = [IsAuthenticated & IsAdmin]  # Seul ADMIN peut CRUD
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['direction_nom']


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('id_service')
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated & IsAdmin]
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['service_nom']
    filterset_fields = ['id_direction']

    def destroy(self, request, *args, **kwargs):
        service = self.get_object()

        # Empêche suppression si utilisé par un utilisateur
        if Utilisateur.objects.filter(id_service=service).exists():
            return Response(
                {"detail": "Impossible de supprimer un service déjà assigné à un utilisateur."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().destroy(request, *args, **kwargs)


class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all().order_by("id_utilisateur")
    serializer_class = UtilisateurSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ["nom_utilisateur", "prenom_utilisateur", "login", "mail"]
    filterset_fields = ["id_role", "id_service", "is_active"]

    def get_permissions(self):
        if self.action in ["me", "change_password"]:
            return [IsAuthenticated()]
        if self.action in ["create", "update", "partial_update", "destroy", "list"]:
            return [IsAdmin()]
        return [IsAuthenticated()]
    
    # --- 1) Mon profil ---
    @action(detail=False, methods=["get"], url_path="me", permission_classes=[IsAuthenticated])
    def me(self, request):
        return Response(UtilisateurSerializer(request.user).data)
    
    # --- 2) Changer mot de passe ---
    @action(detail=True, methods=["post"], url_path="change-password")
    def change_password(self, request, pk=None):
        user = self.get_object()
        s = ChangePasswordSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        if not user.check_password(s.validated_data["old_password"]):
            return Response({"old_password": "Wrong password."}, status=400)

        user.set_password(s.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password updated."})


class LogActionViewSet(BaseViewSet):
    queryset = LogAction.objects.all()
    serializer_class = LogActionSerializer
    permission_classes = [IsAuthenticated]



class ValeurExtraitViewSet(BaseViewSet):
    queryset = ValeurExtrait.objects.all()
    serializer_class = ValeurExtraitSerializer
    permission_classes = [IsAuthenticated]



class ValeurViewSet(BaseViewSet):
    queryset = Valeur.objects.all()
    serializer_class = ValeurSerializer
    permission_classes = [IsAuthenticated]

    # 🔥 Route personnalisée : filtrage par HS Code
    @action(detail=False, methods=["get"])
    def search(self, request):
        hs = request.GET.get("codesh", None)
        if not hs:
            return Response({"error": "codesh manquant"}, status=400)

        valeurs = Valeur.objects.filter(codesh__icontains=hs)
        serializer = self.get_serializer(valeurs, many=True)
        return Response(serializer.data)

    # 🔥 Route personnalisée : upload d’image BLOB
    @action(detail=True, methods=["post"])
    def upload_image(self, request, pk=None):
        instance = self.get_object()
        file = request.FILES.get("image")

        if not file:
            return Response({"error": "Aucun fichier envoyé"}, status=400)

        instance.image = file.read()   # Stocker en BLOB
        instance.save()

        return Response({"message": "Image enregistrée"}, status=200)



class HistoriqueValeurViewSet(BaseViewSet):
    queryset = HistoriqueValeur.objects.all()
    serializer_class = HistoriqueValeurSerializer
    permission_classes = [IsAuthenticated]


class ValidationViewSet(BaseViewSet):
    queryset = Validation.objects.all()
    serializer_class = ValidationSerializer
    permission_classes = [IsAuthenticated]

