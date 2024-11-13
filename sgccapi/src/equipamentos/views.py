import csv
from datetime import datetime
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, filters
from .models import (
    TipoEquipamento,
    Equipamento,
    Manutencao,
    TipoComponente,
    Componente,
)
from usuarios.models import Servidor
from .serializers import (
    TipoEquipamentoSerializer,
    EquipamentoSerializer,
    ManutencaoSerializer,
    TipoComponenteSerializer,
    ComponenteSerializer,
)


# Função auxiliar para validação de datas
def validar_datas(data_inicio, data_fim):
    try:
        data_inicio_dt = datetime.strptime(data_inicio, '%Y-%m-%d')
        data_fim_dt = datetime.strptime(data_fim, '%Y-%m-%d')
    except ValueError:
        raise ValidationError("Formato de data inválido. Use o formato 'YYYY-MM-DD'.")

    if data_inicio_dt > data_fim_dt:
        raise ValidationError("A data de início deve ser anterior à data de fim.")

    return data_inicio_dt, data_fim_dt


# Filtro personalizado para Equipamento
class EquipamentoFilter(FilterSet):
    estado = filters.ChoiceFilter(choices=Equipamento.ESTADO_CHOICES)
    situacao = filters.ChoiceFilter(choices=Equipamento.SITUACAO_CHOICES)
    data_aquisicao = filters.DateFromToRangeFilter()

    class Meta:
        model = Equipamento
        fields = [
            'plaqueta', 'nome', 'marca', 'estado', 'situacao', 
            'sala', 'setor', 'tipo', 'servidor_responsavel', 'data_aquisicao'
        ]


# Filtro para Manutencao
class ManutencaoFilter(FilterSet):
    data = filters.DateFromToRangeFilter()
    responsavel = filters.ModelChoiceFilter(queryset=Servidor.objects.all())

    class Meta:
        model = Manutencao
        fields = ['codigo', 'data', 'equipamento', 'responsavel']


# Filtro para TipoComponente
class TipoComponenteFilter(FilterSet):
    nome = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = TipoComponente
        fields = ['nome', 'descricao']


# Filtro para Componente
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


# Views de ModelViewSet
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
    filterset_class = EquipamentoFilter


class ManutencaoViewSet(viewsets.ModelViewSet):
    queryset = Manutencao.objects.all().order_by('id')
    serializer_class = ManutencaoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ManutencaoFilter


class TipoComponenteViewSet(viewsets.ModelViewSet):
    queryset = TipoComponente.objects.all().order_by('id')
    serializer_class = TipoComponenteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TipoComponenteFilter


class ComponenteViewSet(viewsets.ModelViewSet):
    queryset = Componente.objects.all().order_by('id')
    serializer_class = ComponenteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ComponenteFilter


def exportar_csv(queryset, campos, nome_arquivo, request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{nome_arquivo}.csv"'
    writer = csv.DictWriter(response, fieldnames=campos)
    writer.writeheader()

    for obj in queryset:
        # Aqui usamos um dicionário para mapear os campos corretamente
        data = {campo: getattr(obj, campo, '') if getattr(obj, campo, '') is not None else '' for campo in campos}
        writer.writerow(data)

    return response


# Views de Exportação para CSV
class ExportEquipamentosCSVView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        if not data_inicio or not data_fim:
            raise ValidationError("Os parâmetros 'data_inicio' e 'data_fim' são obrigatórios.")
        
        data_inicio_dt, data_fim_dt = validar_datas(data_inicio, data_fim)

        equipamentos = Equipamento.objects.filter(data_aquisicao__range=[data_inicio_dt, data_fim_dt]).order_by('id')
        campos = ['id', 'plaqueta', 'nome', 'marca', 'estado', 'situacao', 'sala', 'setor', 'tipo', 'servidor', 'data_aquisicao']
        return exportar_csv(equipamentos, campos, f'equipamentos_{data_inicio}_a_{data_fim}', request)


class ExportManutencoesCSVView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        if not data_inicio or not data_fim:
            raise ValidationError("Os parâmetros 'data_inicio' e 'data_fim' são obrigatórios.")

        data_inicio_dt, data_fim_dt = validar_datas(data_inicio, data_fim)

        manutencoes = Manutencao.objects.filter(data__range=[data_inicio_dt, data_fim_dt]).order_by('id')
        campos = ['id', 'codigo', 'data', 'descricao', 'equipamento', 'responsavel']
        return exportar_csv(manutencoes, campos, f'manutencoes_{data_inicio}_a_{data_fim}', request)


class ExportComponentesCSVView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        if not data_inicio or not data_fim:
            raise ValidationError("Os parâmetros 'data_inicio' e 'data_fim' são obrigatórios.")

        data_inicio_dt, data_fim_dt = validar_datas(data_inicio, data_fim)

        componentes = Componente.objects.filter(data_aquisicao__range=[data_inicio_dt, data_fim_dt]).order_by('id')
        campos = ['id', 'codigo', 'nome', 'descricao', 'tipo', 'fabricante', 'tamanho_memoria', 'numero_serie', 'data_aquisicao']
        return exportar_csv(componentes, campos, f'componentes_{data_inicio}_a_{data_fim}', request)