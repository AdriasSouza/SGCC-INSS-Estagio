from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TipoEquipamentoViewSet,
    EquipamentoViewSet,
    ManutencaoViewSet,
    TipoComponenteViewSet,
    ComponenteViewSet,
    EquipComponenteViewSet,
    ExportComponentesCSVView,
    ExportEquipamentosCSVView,
    ExportManutencoesCSVView,
)

# Cria um roteador padrão
router = DefaultRouter()
router.register(r'tipo-equipamento', TipoEquipamentoViewSet)
router.register(r'equipamento', EquipamentoViewSet)
router.register(r'manutencao', ManutencaoViewSet)
router.register(r'tipo-componente', TipoComponenteViewSet)
router.register(r'componente', ComponenteViewSet)
router.register(r'equip-componente', EquipComponenteViewSet)

# Inclui as URLs do roteador nas URLs principais
urlpatterns = [
    path('export-equipamentos-csv/', ExportEquipamentosCSVView.as_view()),
    path('export-manutencoes-csv/', ExportManutencoesCSVView.as_view()),
    path('export-componentes-csv/', ExportComponentesCSVView.as_view()),
    path('', include(router.urls)),
]
