from rest_framework import serializers
from .models import (
    TipoEquipamento,
    Equipamento,
    Manutencao,
    TipoComponente,
    Componente,
    EquipComponente
)


# Serializer para o modelo TipoEquipamento
class TipoEquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEquipamento
        fields = ['id', 'nome', 'descricao']


# Serializer para o modelo Equipamento
class EquipamentoSerializer(serializers.ModelSerializer):
    tipo = serializers.PrimaryKeyRelatedField(
        queryset=TipoEquipamento.objects.all()
        )
    
    class Meta:
        model = Equipamento
        fields = ['id', 'plaqueta', 'nome', 'marca', 'estado',
                  'situacao', 'sala', 'tipo', 'servidor', 'data_aquisicao']


# Serializer para o modelo Manutencao
class ManutencaoSerializer(serializers.ModelSerializer):
    equipamento = serializers.PrimaryKeyRelatedField(
        queryset=Equipamento.objects.all()
        )
    
    class Meta:
        model = Manutencao
        fields = ['id', 'codigo', 'data_inicio', 'data_fim',
                  'descricao', 'equipamento', 'responsavel']


# Serializer para o modelo TipoComponente
class TipoComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComponente
        fields = ['id', 'nome', 'descricao']


# Serializer para o modelo Componente
class ComponenteSerializer(serializers.ModelSerializer):
    tipo = serializers.PrimaryKeyRelatedField(
        queryset=TipoComponente.objects.all()
        )
    
    class Meta:
        model = Componente
        fields = ['id', 'codigo', 'nome', 'descricao', 'tipo', 'fabricante',
                  'tamanho_mem', 'n_serie', 'data_aquisicao']


# Serializer para o modelo EquipComponente
class EquipComponenteSerializer(serializers.ModelSerializer):
    equip = serializers.PrimaryKeyRelatedField(
        queryset=Equipamento.objects.all(), many=True
        )
    componente = serializers.PrimaryKeyRelatedField(
        queryset=Componente.objects.all(), many=True
        )

    class Meta:
        model = EquipComponente
        fields = ['id', 'equip', 'componente']
