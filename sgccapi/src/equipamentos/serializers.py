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
    ServidorSerializer,
    SetorSerializer
)


class TipoEquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEquipamento
        fields = ['id', 'nome', 'descricao']


class EquipamentoSerializer(serializers.ModelSerializer):
    tipo = serializers.PrimaryKeyRelatedField(queryset=TipoEquipamento.objects.all())
    setor = serializers.PrimaryKeyRelatedField(queryset=Setor.objects.all())
    servidor = serializers.PrimaryKeyRelatedField(queryset=Servidor.objects.all())

    class Meta:
        model = Equipamento
        fields = [
            'id', 'plaqueta', 'nome', 'marca', 'estado', 'situacao',
            'sala', 'setor', 'tipo', 'servidor', 'data_aquisicao'
        ]

    def to_representation(self, instance):
        """Usa um serializer aninhado para retornar dados completos em GET."""
        representation = super().to_representation(instance)
        representation['tipo'] = TipoEquipamentoSerializer(instance.tipo).data
        representation['setor'] = SetorSerializer(instance.tipo).data
        representation['servidor'] = ServidorSerializer(instance.tipo).data
        return representation


class ManutencaoSerializer(serializers.ModelSerializer):
    equipamento = serializers.PrimaryKeyRelatedField(queryset=Equipamento.objects.all())
    responsavel = serializers.PrimaryKeyRelatedField(queryset=Servidor.objects.all())

    class Meta:
        model = Manutencao
        fields = [
            'id', 'codigo', 'data', 'descricao', 'equipamento', 'responsavel',
        ]

    def to_representation(self, instance):
        """Usa um serializer aninhado para retornar dados completos em GET."""
        representation = super().to_representation(instance)
        representation['equipamento'] = EquipamentoSerializer(instance.equipamento).data
        representation['responsavel'] = ServidorSerializer(instance.responsavel).data  # Retorna o objeto completo
        return representation


class TipoComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComponente
        fields = ['id', 'nome', 'descricao']


class ComponenteSerializer(serializers.ModelSerializer):
    tipo = serializers.PrimaryKeyRelatedField(queryset=TipoComponente.objects.all())

    class Meta:
        model = Componente
        fields = [
            'id', 'codigo', 'nome', 'descricao', 'tipo',
            'fabricante', 'tamanho_mem', 'n_serie', 'data_aquisicao'
        ]

    def to_representation(self, instance):
        """Usa um serializer aninhado para retornar dados completos em GET."""
        representation = super().to_representation(instance)
        representation['tipo'] = TipoComponenteSerializer(instance.tipo).data
        return representation


class EquipComponenteSerializer(serializers.ModelSerializer):
    equip = serializers.PrimaryKeyRelatedField(queryset=Equipamento.objects.all(), many=True)
    componente = serializers.PrimaryKeyRelatedField(queryset=Componente.objects.all(), many=True)

    class Meta:
        model = EquipComponente
        fields = ['id', 'equip', 'componente']

    def to_representation(self, instance):
        """Usa um serializer aninhado para retornar dados completos em GET."""
        representation = super().to_representation(instance)
        representation['equip'] = EquipamentoSerializer(instance.equip, many=True).data
        representation['componente'] = ComponenteSerializer(instance.componente, many=True).data
        return representation
