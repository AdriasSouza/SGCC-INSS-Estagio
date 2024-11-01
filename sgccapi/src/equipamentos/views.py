import csv
from datetime import datetime
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, filters
from .models import (
    TipoEquipamento,
    Equipamento,
    Manutencao,
    TipoComponente,
    Componente,
    EquipComponente
)
from usuarios.models import Servidor
from .serializers import (
    TipoEquipamentoSerializer,
    EquipamentoSerializer,
    ManutencaoSerializer,
    TipoComponenteSerializer,
    ComponenteSerializer,
    EquipComponenteSerializer
)


# Definindo um filtro personalizado para Equipamento
class EquipamentoFilter(FilterSet):
    estado = filters.ChoiceFilter(choices=Equipamento.ESTADO_CHOICES)
    situacao = filters.ChoiceFilter(choices=Equipamento.SITUACAO_CHOICES)
    data_aquisicao = filters.DateFromToRangeFilter()

    class Meta:
        model = Equipamento
        fields = [
            'plaqueta', 'nome', 'marca', 'estado', 'situacao', 
            'sala', 'setor', 'tipo', 'servidor', 'data_aquisicao'
        ]


# Definindo um filtro personalizado para Manutencao
class ManutencaoFilter(FilterSet):
    data = filters.DateFromToRangeFilter()
    responsavel = filters.ModelChoiceFilter(queryset=Servidor.objects.all())

    class Meta:
        model = Manutencao
        fields = ['codigo', 'data', 'equipamento', 'responsavel']


# Definindo um filtro personalizado para TipoComponente
class TipoComponenteFilter(FilterSet):
    nome = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = TipoComponente
        fields = ['nome', 'descricao']


# Definindo um filtro personalizado para Componente
class ComponenteFilter(FilterSet):
    tipo = filters.ModelChoiceFilter(queryset=TipoComponente.objects.all())
    fabricante = filters.CharFilter(lookup_expr='icontains') 
    data_aquisicao = filters.DateFromToRangeFilter()

    class Meta:
        model = Componente
        fields = [
            'codigo', 'nome', 'tipo', 'fabricante', 
            'tamanho_mem', 'n_serie', 'data_aquisicao'
        ]


# Definindo um filtro personalizado para EquipComponente
class EquipComponenteFilter(FilterSet):
    equip = filters.ModelChoiceFilter(queryset=Equipamento.objects.all())
    componente = filters.ModelChoiceFilter(queryset=Componente.objects.all())

    class Meta:
        model = EquipComponente
        fields = ['equip', 'componente']


class TipoEquipamentoViewSet(viewsets.ModelViewSet):
    queryset = TipoEquipamento.objects.all().order_by('id')
    serializer_class = TipoEquipamentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nome', 'descricao']


class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all().order_by('id')
    serializer_class = EquipamentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = EquipamentoFilter  # Usando o filtro personalizado


class ManutencaoViewSet(viewsets.ModelViewSet):
    queryset = Manutencao.objects.all().order_by('id')
    serializer_class = ManutencaoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ManutencaoFilter  # Usando o filtro personalizado


class TipoComponenteViewSet(viewsets.ModelViewSet):
    queryset = TipoComponente.objects.all().order_by('id')
    serializer_class = TipoComponenteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TipoComponenteFilter  # Usando o filtro personalizado


class ComponenteViewSet(viewsets.ModelViewSet):
    queryset = Componente.objects.all().order_by('id')
    serializer_class = ComponenteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ComponenteFilter  # Usando o filtro personalizado


class EquipComponenteViewSet(viewsets.ModelViewSet):
    queryset = EquipComponente.objects.all().order_by('id')
    serializer_class = EquipComponenteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = EquipComponenteFilter  # Usando o filtro personalizado


class ExportEquipamentosCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        if not data_inicio or not data_fim:
            raise ValidationError(
                "Os parâmetros 'data_inicio' e 'data_fim' são obrigatórios."
                )

        try:
            data_inicio_dt = datetime.strptime(data_inicio, '%Y-%m-%d')
            data_fim_dt = datetime.strptime(data_fim, '%Y-%m-%d')
        except ValueError:
            raise ValidationError(
                "Formato de data inválido. Use o formato 'YYYY-MM-DD'."
                )

        if data_inicio_dt > data_fim_dt:
            raise ValidationError(
                "A data de início deve ser anterior à data de fim."
                )

        equipamentos = Equipamento.objects.filter(
            data_aquisicao__range=[data_inicio, data_fim]
            ).order_by('id')

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="equipamentos_{data_inicio}_a_{data_fim}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Plaqueta', 'Nome', 'Marca', 'Estado', 'Situacao', 'Sala',
            'Setor', 'Tipo', 'Servidor', 'Data Aquisição'
            ])

        for equipamento in equipamentos:
            writer.writerow([
                equipamento.id, equipamento.plaqueta, equipamento.nome,
                equipamento.marca, equipamento.estado, equipamento.situacao,
                equipamento.sala, equipamento.setor.nome if equipamento.setor else '',
                equipamento.tipo.nome if equipamento.tipo else '',
                equipamento.servidor.nome_completo if equipamento.servidor else '',
                equipamento.data_aquisicao
                ])

        return response


class ExportManutencoesCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        if not data_inicio or not data_fim:
            raise ValidationError(
                "Os parâmetros 'data_inicio' e 'data_fim' são obrigatórios."
                )

        try:
            data_inicio_dt = datetime.strptime(data_inicio, '%Y-%m-%d')
            data_fim_dt = datetime.strptime(data_fim, '%Y-%m-%d')
        except ValueError:
            raise ValidationError(
                "Formato de data inválido. Use o formato 'YYYY-MM-DD'."
                )

        if data_inicio_dt > data_fim_dt:
            raise ValidationError(
                "A data de início deve ser anterior à data de fim."
                )

        manutencoes = Manutencao.objects.filter(
            data__range=[data_inicio, data_fim]
            ).order_by('id')

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="manutencoes_{data_inicio}_a_{data_fim}.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Código', 'Data', 'Descrição', 'Equipamento', 'Responsável'
            ])

        for manutencao in manutencoes:
            writer.writerow([manutencao.id, manutencao.codigo, manutencao.data, manutencao.descricao, manutencao.equipamento.nome if manutencao.equipamento else '', manutencao.responsavel.nome_completo if manutencao.responsavel else ''])

        return response


class ExportComponentesCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        if not data_inicio or not data_fim:
            raise ValidationError(
                "Os parâmetros 'data_inicio' e 'data_fim' são obrigatórios."
                )

        try:
            data_inicio_dt = datetime.strptime(data_inicio, '%Y-%m-%d')
            data_fim_dt = datetime.strptime(data_fim, '%Y-%m-%d')
        except ValueError:
            raise ValidationError(
                "Formato de data inválido. Use o formato 'YYYY-MM-DD'."
                )

        if data_inicio_dt > data_fim_dt:
            raise ValidationError(
                "A data de início deve ser anterior à data de fim."
                )

        componentes = Componente.objects.filter(
            data_aquisicao__range=[data_inicio, data_fim]
            ).order_by('id')

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="componentes_{data_inicio}_a_{data_fim}.csv"'
   
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Código', 'Nome', 'Descrição', 'Tipo', 'Fabricante',
            'Tamanho Memória', 'Número de Série', 'Data Aquisição'
            ])

        for componente in componentes:
            writer.writerow([componente.id, componente.codigo, componente.nome,
                             componente.descricao, componente.tipo.nome if componente.tipo else '',
                             componente.fabricante, componente.tamanho_mem, componente.n_serie,
                             componente.data_aquisicao])

        return response
