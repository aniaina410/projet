from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager

class Role(models.Model):
    id_role = models.AutoField(primary_key=True)
    role_nom = models.CharField(max_length=255, unique=True)
    description_role = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.role_nom

class Direction(models.Model):
    id_direction = models.AutoField(primary_key=True)
    direction_nom = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.direction_nom

class Service(models.Model):
    id_service = models.AutoField(primary_key=True)
    service_nom = models.CharField(max_length=255)
    id_direction = models.ForeignKey(Direction, on_delete=models.PROTECT)

    def __str__(self):
        return self.service_nom
    
class UtilisateurManager(BaseUserManager):
    use_in_migartions = True
    
    def create_user(self, login, password=None, **extra_fields):
        if not login:
            raise ValueError("L'utilisateur doit avoir un login")
        user = self.model(login=login, **extra_fields)
        
        #gere le hash du mot de passe
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, login, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(login, password, **extra_fields)

class Utilisateur(AbstractBaseUser, PermissionsMixin):
    id_utilisateur = models.AutoField(primary_key=True)
    matricule = models.BigIntegerField()
    nom_utilisateur = models.CharField(max_length=255)
    prenom_utilisateur = models.CharField(max_length=255)
    login = models.CharField(max_length=255, unique=True)
    mail = models.EmailField()
    id_role = models.ForeignKey('Role', on_delete=models.PROTECT, null=True, blank=True)
    id_service = models.ForeignKey('Service', on_delete=models.PROTECT, null=True, blank=True)



    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "login"
    REQUIRED_FIELDS = ["matricule", "nom_utilisateur", "prenom_utilisateur", "mail"]

    objects = UtilisateurManager()

    def save(self, *args, **kwargs):
        # Hash le mot de passe seulement s'il n'est PAS déjà hashé
        if not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    
    def has_perm(self, perm, obj=None) :
        if self.id_role.role_nom == "ADMIN":
            return True
        return super().has_perm(perm, obj)
    
    def has_perm(self, app_label):
        if self.id_role.role_nom == "ADMIN":
            return True
        return super().has_module_perms(app_label)
    
    def __str__(self):
        return f"{self.nom_utilisateur} {self.prenom_utilisateur}"

class LogAction(models.Model):
    id_log = models.AutoField(primary_key=True)
    action = models.CharField(max_length=255)
    ip_adresse = models.CharField(max_length=255)
    navigateur = models.CharField(max_length=255)
    date_action = models.DateTimeField(auto_now_add=True)
    id_utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)

class ValeurExtrait(models.Model):
    id_extraction = models.AutoField(primary_key=True)
    date_extraction = models.DateField()
    serdau = models.CharField(max_length=255)
    datedau = models.DateField()
    liquide = models.CharField(max_length=255)
    dateliquide = models.DateField()
    importateur = models.CharField(max_length=255)
    exportateur = models.CharField(max_length=255)
    pays_destinataire = models.CharField(max_length=255)
    description_article = models.CharField(max_length=255)
    poid_brut = models.DecimalField(max_digits=19, decimal_places=2)
    poid_net = models.DecimalField(max_digits=19, decimal_places=2)
    quantite = models.DecimalField(max_digits=19, decimal_places=2)
    unite = models.CharField(max_length=255)
    prix_article = models.DecimalField(max_digits=19, decimal_places=2)
    incoterm = models.CharField(max_length=255)
    id_utilisateur = models.ForeignKey(Utilisateur, on_delete=models.PROTECT)

class Valeur(models.Model):
    id_valeur = models.AutoField(primary_key=True)
    codesh = models.CharField(max_length=255)
    descrip = models.CharField(max_length=255)
    unite = models.CharField(max_length=255)
    quantite = models.DecimalField(max_digits=19, decimal_places=2)
    pu_fact = models.DecimalField(max_digits=19, decimal_places=2)
    pu_redr = models.DecimalField(max_digits=19, decimal_places=2)
    methode = models.CharField(max_length=255)
    incoterm = models.CharField(max_length=255)
    devise = models.CharField(max_length=255)
    source = models.CharField(max_length=255)
    ref_fact = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    details_marchandises = models.CharField(max_length=255)
    poid_brut = models.DecimalField(max_digits=19, decimal_places=2)
    poid_net = models.DecimalField(max_digits=19, decimal_places=2)
    exportateur = models.CharField(max_length=255)
    pays_destinataire = models.CharField(max_length=255)
    importateur = models.CharField(max_length=255)
    conditionnement = models.CharField(max_length=255)
    image = models.BinaryField(null=True, blank=True)
    date_effet = models.DateField()
    id_extraction = models.ForeignKey(ValeurExtrait, null=True, blank=True, on_delete=models.SET_NULL)
    id_utilisateur = models.ForeignKey(Utilisateur, on_delete=models.PROTECT)

class HistoriqueValeur(models.Model):
    id_historique = models.AutoField(primary_key=True)
    champ_modifies = models.CharField(max_length=255)
    ancienne_valeur = models.CharField(max_length=255)
    nouvelle_valeur = models.CharField(max_length=255)
    date_modif = models.DateTimeField(auto_now_add=True)
    id_valeur = models.ForeignKey(Valeur, on_delete=models.CASCADE)
    id_utilisateur = models.ForeignKey(Utilisateur, on_delete=models.PROTECT)

class Validation(models.Model):
    id_validation = models.AutoField(primary_key=True)
    decision = models.CharField(max_length=255)
    date_validation = models.DateField(null=True, blank=True)
    id_extraction = models.ForeignKey(ValeurExtrait, on_delete=models.CASCADE)
    id_utilisateur = models.ForeignKey(Utilisateur, on_delete=models.PROTECT)
