from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

from .models import (
    Role, Direction, Service, Utilisateur,
    LogAction, ValeurExtrait, Valeur,
    HistoriqueValeur, Validation
)

# =====================================================
# AUTHENTIFICATION
# =====================================================
class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(
            login=data["login"],
            password=data["password"]
        )
        if not user:
            raise serializers.ValidationError("Login ou mot de passe incorrect")
        data["user"] = user
        return data

class ChangeLoginSerializer(serializers.Serializer):
    new_login = serializers.CharField()

    def validate_new_login(self, value):
        if Utilisateur.objects.filter(login=value).exists():
            raise serializers.ValidationError("Login déjà utilisé")
        return value

class CreateUserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)
    service = serializers.CharField(write_only=True)

    class Meta:
        model = Utilisateur
        fields = [
            "nom_utilisateur",
            "prenom_utilisateur",
            "matricule",
            "mail",
            "login",
            "password",
            "role",
            "service",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        role_name = validated_data.pop("role")
        service_name = validated_data.pop("service")

        # 🔎 Récupération du role par nom
        try:
            role = Role.objects.get(role_nom__iexact=role_name)
        except Role.DoesNotExist:
            raise serializers.ValidationError({
                "role": "Rôle invalide"
            })

        # 🔎 Récupération du service par nom
        try:
            service = Service.objects.get(service_nom__iexact=service_name)
        except Service.DoesNotExist:
            raise serializers.ValidationError({
                "service": "Service invalide"
            })

        # Création utilisateur
        user = Utilisateur(
            id_role=role,
            id_service=service,
            **validated_data
        )
        user.set_password(validated_data["password"])
        user.save()

        return user

# =====================================================
# ROLE
# =====================================================
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


# =====================================================
# DIRECTION
# =====================================================
class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = "__all__"


# =====================================================
# SERVICE
# =====================================================
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


# =====================================================
# UTILISATEUR
# =====================================================
class UtilisateurSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Utilisateur
        fields = [
            "id_utilisateur",
            "login",
            "password",
            "nom_utilisateur",
            "prenom_utilisateur",
	    "matricule",
            "mail",
            "id_role",
            "id_service",
            "is_active",
            "is_staff",
        ]
        read_only_fields = ["id_utilisateur"]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = Utilisateur(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()


# =====================================================
# VALEUR EXTRAIT
# =====================================================
class ValeurExtraitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValeurExtrait
        fields = "__all__"
        read_only_fields = ["id_extraction"]

# =====================================================
# VALEUR
# =====================================================
class ValeurSerializer(serializers.ModelSerializer):
    # image = lien texte, PAS fichier
    image = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Valeur
        fields = "__all__"
        read_only_fields = [
            "id_valeur",
            "id_utilisateur",
            "id_extraction",
            "status",
        ]

    def validate(self, attrs):
        numeric_fields = [
            "quantite",
            "pu_fact",
            "pu_redr",
            "poid_brut",
            "poid_net",
        ]

        for field in numeric_fields:
            if attrs.get(field) in ("", None):
                attrs[field] = None

        return attrs


# =====================================================
# HISTORIQUE / VALIDATION
# =====================================================
class HistoriqueValeurSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriqueValeur
        fields = "__all__"


class ValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Validation
        fields = "__all__"

# =====================================================
# LOG ACTION
# =====================================================
class LogActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogAction
        fields = "__all__"

