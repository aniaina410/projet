from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Utilisateur

class LoginView(APIView):
    permission_classes = [permissions.AllowAny] 

    def post(self, request):
        login = request.data.get("login")
        password = request.data.get("password")

        try:
            user = Utilisateur.objects.get(login=login)
        except Utilisateur.DoesNotExist:
            return Response({"detail": "Login incorrect"}, status=400)

        if not check_password(password, user.password):
            return Response({"detail": "Mot de passe incorrect"}, status=400)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response({
            "access": str(access),
            "refresh": str(refresh),
            "utilisateur": {
                "id": user.id_utilisateur,
                "nom": user.nom_utilisateur,
                "prenom": user.prenom_utilisateur,
                "role": user.id_role.role_nom
            }
        })



