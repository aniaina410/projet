from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .authentification import LoginView
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RoleViewSet, DirectionViewSet, ServiceViewSet, UtilisateurViewSet,
    LogActionViewSet, ValeurExtraitViewSet, ValeurViewSet,
    HistoriqueValeurViewSet, ValidationViewSet
)

router = DefaultRouter()

router.register("roles", RoleViewSet)
router.register("directions", DirectionViewSet)
router.register("services", ServiceViewSet)
router.register("utilisateurs", UtilisateurViewSet)
router.register("logs", LogActionViewSet)
router.register("extraits", ValeurExtraitViewSet)
router.register("valeurs", ValeurViewSet)
router.register("historiques", HistoriqueValeurViewSet)
router.register("validations", ValidationViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
