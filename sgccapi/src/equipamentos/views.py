from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated  # Importa permissão
from django_filters.rest_framework import DjangoFilterBackend  # Importa filtro
from .models import (
    TipoEquipamento,
    Equipamento,
    Manutencao,
    TipoComponente,
    Componente,
    EquipComponente
)
from .serializers import (
    TipoEquipamentoSerializer,
    EquipamentoSerializer,
    ManutencaoSerializer,
    TipoComponenteSerializer,
    ComponenteSerializer,
    EquipComponenteSerializer
)


# ViewSet para CRUD de TipoEquipamento
class TipoEquipamentoViewSet(viewsets.ModelViewSet):
    queryset = TipoEquipamento.objects.all()
    serializer_class = TipoEquipamentoSerializer
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['nome', 'descricao']  # Campos que podem ser filtrados


# ViewSet para CRUD de Equipamento
class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['plaqueta', 'nome', 'marca', 
                        'estado', 'situacao', 'sala', 'tipo']
    # Campos filtráveis


# ViewSet para CRUD de Manutencao
class ManutencaoViewSet(viewsets.ModelViewSet):
    queryset = Manutencao.objects.all()
    serializer_class = ManutencaoSerializer
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['codigo', 'equipamento', 'responsavel']
    # Campos filtráveis


# ViewSet para CRUD de TipoComponente
class TipoComponenteViewSet(viewsets.ModelViewSet):
    queryset = TipoComponente.objects.all()
    serializer_class = TipoComponenteSerializer
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['nome', 'descricao']  # Campos que podem ser filtrados


# ViewSet para CRUD de Componente
class ComponenteViewSet(viewsets.ModelViewSet):
    queryset = Componente.objects.all()
    serializer_class = ComponenteSerializer
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['codigo', 'nome', 'tipo', 'fabricante']
    # Campos filtráveis


# ViewSet para CRUD de EquipComponente
class EquipComponenteViewSet(viewsets.ModelViewSet):
    queryset = EquipComponente.objects.all()
    serializer_class = EquipComponenteSerializer
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['equip', 'componente']  # Campos filtráveis
