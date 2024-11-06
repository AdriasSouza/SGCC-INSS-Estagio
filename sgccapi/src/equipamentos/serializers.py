from rest_framework import serializers
from .models import (
    TipoEquipamento,
    Equipamento,
    Manutencao,
    TipoComponente,
    Componente,
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
    componentes = serializers.PrimaryKeyRelatedField(queryset=Componente.objects.all(), allow_null=True, many=True)
    # estado = serializers.CharField(source='get_estado_display', read_only=True)
    # situacao = serializers.CharField(source='get_situacao_display', read_only=True)

    class Meta:
        model = Equipamento
        fields = [
            'id', 'plaqueta', 'nome', 'marca', 'estado', 'situacao', 'componentes',
            'sala', 'setor', 'tipo', 'servidor', 'data_aquisicao'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tipo'] = TipoEquipamentoSerializer(instance.tipo).data
        representation['setor'] = SetorSerializer(instance.setor).data
        representation['servidor'] = ServidorSerializer(instance.servidor).data
        representation['componentes'] = ComponenteSerializer(instance.componentes.all(), many=True).data
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
