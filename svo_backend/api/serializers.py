from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import (
    Role, Direction, Service, Utilisateur,
    LogAction, ValeurExtrait, Valeur,
    HistoriqueValeur, Validation
)


# ---------------------
# ROLE
# ---------------------
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


# ---------------------
# DIRECTION
# ---------------------
class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = ['id_direction', 'direction_nom']


# ---------------------
# SERVICE
# ---------------------
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id_service', 'service_nom', 'id_direction']


# ---------------------
# UTILISATEUR
# ---------------------
class UtilisateurSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Utilisateur
        fields = [
            "id_utilisateur", "matricule", "nom_utilisateur", "prenom_utilisateur",
            "login", "mail", "password", "id_role", "id_service",
            "is_active", "is_staff"
        ]
        read_only_fields = ["id_utilisateur"]

    def validate_password(self, pwd):
        return make_password(pwd)

    def update(self, instance, validated_data):
        pwd = validated_data.get("password", None)
        if pwd:
            instance.password = make_password(pwd)
            validated_data.pop("password")
        return super().update(instance, validated_data)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class CreateUserSerializer(serializers.ModelSerializer):
    """Serializer dédié à la création (si tu veux exposer un endpoint public de register)"""
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Utilisateur
        fields = ('login','password','matricule','nom_utilisateur','prenom_utilisateur','mail','id_role','id_service')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Utilisateur(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

 

# ---------------------
# LOG ACTION
# ---------------------
class LogActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogAction
        fields = '__all__'


# ---------------------
# VALEUR EXTRAIT
# ---------------------
class ValeurExtraitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValeurExtrait
        fields = '__all__'


# ---------------------
# VALEUR
# ---------------------
class ValeurSerializer(serializers.ModelSerializer):

    # Permet d’afficher l’image en base64
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            return obj.image.hex()  # ou base64 si tu préfères plus tard
        return None

    class Meta:
        model = Valeur
        fields = '__all__'


# ---------------------
# HISTORIQUE VALEUR
# ---------------------
class HistoriqueValeurSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriqueValeur
        fields = '__all__'


# ---------------------
# VALIDATION
# ---------------------
class ValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Validation
        fields = '__all__'