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


# Serializer para o modelo TipoEquipamento
class TipoEquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEquipamento
        # Campos que serão incluídos na serialização
        fields = ['id', 'nome', 'descricao']


# Serializer para o modelo Equipamento
class EquipamentoSerializer(serializers.ModelSerializer):
    # Relacionamento com o modelo TipoEquipamento
    tipo = serializers.PrimaryKeyRelatedField(queryset=TipoEquipamento.objects.all())
    # Relacionamento com o modelo Setor
    setor = serializers.PrimaryKeyRelatedField(queryset=Setor.objects.all())
    # Relacionamento com o modelo Servidor
    servidor_responsavel = serializers.PrimaryKeyRelatedField(queryset=Servidor.objects.all())
    # Relacionamento com o modelo Componente (permitindo múltiplos e null)
    componentes = serializers.PrimaryKeyRelatedField(queryset=Componente.objects.all(), allow_null=True, many=True)

    class Meta:
        model = Equipamento
        # Campos que serão incluídos na serialização
        fields = [
            'id', 'plaqueta', 'nome', 'marca', 'estado', 'situacao', 'componentes',
            'sala', 'setor', 'tipo', 'servidor_responsavel', 'data_aquisicao'
        ]

    def to_representation(self, instance):
        """Modifica a representação dos dados para incluir objetos completos ao invés de IDs."""
        representation = super().to_representation(instance)
        # Aqui, cada campo relacionado é substituído por seus dados completos, utilizando seus respectivos serializers
        representation['tipo'] = TipoEquipamentoSerializer(instance.tipo).data
        representation['setor'] = SetorSerializer(instance.setor).data
        representation['servidor_responsavel'] = ServidorSerializer(instance.servidor_responsavel).data
        # Se o campo 'componentes' estiver presente, ele será serializado como uma lista de objetos
        representation['componentes'] = ComponenteSerializer(instance.componentes.all(), many=True).data
        return representation


# Serializer para o modelo Manutencao
class ManutencaoSerializer(serializers.ModelSerializer):
    # Relacionamento com o modelo Equipamento
    equipamento = serializers.PrimaryKeyRelatedField(queryset=Equipamento.objects.all())
    # Relacionamento com o modelo Servidor
    responsavel = serializers.PrimaryKeyRelatedField(queryset=Servidor.objects.all())

    class Meta:
        model = Manutencao
        # Campos que serão incluídos na serialização
        fields = [
            'id', 'codigo', 'data', 'descricao', 'equipamento', 'responsavel',
        ]

    def to_representation(self, instance):
        """Usa um serializer aninhado para retornar dados completos em GET."""
        representation = super().to_representation(instance)
        # Serializa o equipamento e o responsável, substituindo os IDs pelos dados completos
        representation['equipamento'] = EquipamentoSerializer(instance.equipamento).data
        representation['responsavel'] = ServidorSerializer(instance.responsavel).data
        return representation


# Serializer para o modelo TipoComponente
class TipoComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComponente
        # Campos que serão incluídos na serialização
        fields = ['id', 'nome', 'descricao']


# Serializer para o modelo Componente
class ComponenteSerializer(serializers.ModelSerializer):
    # Relacionamento com o modelo TipoComponente
    tipo = serializers.PrimaryKeyRelatedField(queryset=TipoComponente.objects.all())

    class Meta:
        model = Componente
        # Campos que serão incluídos na serialização
        fields = [
            'id', 'codigo', 'nome', 'descricao', 'tipo',
            'fabricante', 'tamanho_mem', 'n_serie', 'data_aquisicao'
        ]

    def to_representation(self, instance):
        """Usa um serializer aninhado para retornar dados completos em GET."""
        representation = super().to_representation(instance)
        # Substitui o campo 'tipo' pelo objeto completo serializado
        representation['tipo'] = TipoComponenteSerializer(instance.tipo).data
        return representation