from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TipoEquipamentoViewSet,
    EquipamentoViewSet,
    ManutencaoViewSet
    )

# Cria o router para os ViewSets
router = DefaultRouter()

# Registra as rotas para os ViewSets
router.register(
    r'tipos-equipamentos', TipoEquipamentoViewSet, basename='tipo-equipamento'
    )
router.register(
    r'equipamentos', EquipamentoViewSet, basename='equipamento'
    )
router.register(
    r'manutencao', ManutencaoViewSet, basename='manutencao'
    )

# Inclui as rotas no padrão da API
urlpatterns = [
    path('api/', include(router.urls)),
]

# Opcional: se desejar adicionar uma rota para documentação da API
# path('api/docs/', include('rest_framework_swagger.urls')), # Swagger
# path('api/docs/', include('drf_yasg.urls')), # Redoc
