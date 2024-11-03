from rest_framework import serializers
from .models import (
    TipoEquipamento,
    Equipamento,
    Manutencao,
    TipoComponente,
    Componente,
    EquipComponente,
    )
from usuarios.models import (
    Setor,
    Servidor
)
from usuarios.serializers import (
    SetorSerializer,
    ServidorSerializer
)


class TipoEquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEquipamento
        fields = ['id', 'nome', 'descricao']


class EquipamentoSerializer(serializers.ModelSerializer):
    tipo = TipoEquipamentoSerializer(read_only=True)
    setor = SetorSerializer(read_only=True)
    servidor = ServidorSerializer(read_only=True)

    class Meta:
        model = Equipamento
        fields = [
            'id', 'plaqueta', 'nome', 'marca', 'estado', 'situacao',
            'sala', 'setor', 'tipo', 'servidor', 'data_aquisicao'
            ]


class ManutencaoSerializer(serializers.ModelSerializer):
    equipamento = EquipamentoSerializer(read_only=True)
    responsavel = ServidorSerializer(read_only=True)

    class Meta:
        model = Manutencao
        fields = [
            'id', 'codigo', 'data', 'descricao', 'equipamento', 'responsavel',
            ]


class TipoComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComponente
        fields = ['id', 'nome', 'descricao']


class ComponenteSerializer(serializers.ModelSerializer):
    tipo = TipoComponenteSerializer(read_only=True)

    class Meta:
        model = Componente
        fields = [
            'id', 'codigo', 'nome', 'descricao', 'tipo',
            'fabricante', 'tamanho_mem', 'n_serie', 'data_aquisicao'
            ]


class EquipComponenteSerializer(serializers.ModelSerializer):
    equip = EquipamentoSerializer(read_only=True, many=True)
    componente = ComponenteSerializer(read_only=True, many=True)

    class Meta:
        model = EquipComponente
        fields = ['id', 'equip', 'componente']
