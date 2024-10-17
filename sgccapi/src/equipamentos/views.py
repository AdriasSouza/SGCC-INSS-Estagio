from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import TipoEquipamento, Equipamento, Manutencao
from .serializers import (
    TipoEquipamentoSerializer,
    EquipamentoSerializer,
    ManutencaoSerializer
    )
from rest_framework.pagination import PageNumberPagination


class SmallResultsSetPagination(PageNumberPagination):
    page_size = 10


# ViewSet para o modelo TipoEquipamento
class TipoEquipamentoViewSet(viewsets.ModelViewSet):
    queryset = TipoEquipamento.objects.all()
    serializer_class = TipoEquipamentoSerializer
    permission_classes = [IsAuthenticated]


# ViewSet para o modelo Equipamento
class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SmallResultsSetPagination  # Paginação
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['estado', 'situacao', 'sala']  # Filtros exatos
    search_fields = ['nome', 'marca']  # Pesquisa textual

    def perform_create(self, serializer):
        serializer.save(servidor=self.request.user.servidor)

    def perform_update(self, serializer):
        serializer.save()


# ViewSet para o modelo Manutencao
class ManutencaoViewSet(viewsets.ModelViewSet):
    queryset = Manutencao.objects.all()
    serializer_class = ManutencaoSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SmallResultsSetPagination  # Paginação
