from rest_framework import serializers
from .models import TipoEquipamento, Equipamento, Manutencao

# Serializer para o modelo TipoEquipamento
class TipoEquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEquipamento
        fields = ['id', 'nome']  # Inclui os campos 'id' e 'nome'


# Serializer para o modelo Equipamento
class EquipamentoSerializer(serializers.ModelSerializer):
    tipo = TipoEquipamentoSerializer()  # Serializa o campo 'tipo' relacionado
    servidor = serializers.StringRelatedField()  # Exibe o servidor como string

    class Meta:
        model = Equipamento
        fields = [
            'id', 'plaqueta', 'nome', 'marca', 'estado', 'situacao',
            'sala', 'tipo', 'servidor'
        ]

    def create(self, validated_data):
        tipo_data = validated_data.pop('tipo')
        tipo = TipoEquipamento.objects.create(**tipo_data)
        equipamento = Equipamento.objects.create(tipo=tipo, **validated_data)
        return equipamento

    def update(self, instance, validated_data):
        tipo_data = validated_data.pop('tipo', None)

        if tipo_data:
            tipo = instance.tipo
            tipo.nome = tipo_data.get('nome', tipo.nome)
            tipo.save()

        instance.nome = validated_data.get('nome', instance.nome)
        instance.marca = validated_data.get('marca', instance.marca)
        instance.estado = validated_data.get('estado', instance.estado)
        instance.situacao = validated_data.get('situacao', instance.situacao)
        instance.sala = validated_data.get('sala', instance.sala)

        instance.save()
        return instance


# Serializer para o modelo Manutencao
class ManutencaoSerializer(serializers.ModelSerializer):
    # Serializa o campo 'equipamento'
    equipamento = EquipamentoSerializer()
    # Exibe o responsável como string
    responsavel = serializers.StringRelatedField()

    class Meta:
        model = Manutencao
        fields = [
            'id', 'codigo', 'data', 'descricao', 'equipamento', 'responsavel'
        ]

    def create(self, validated_data):
        equipamento_data = validated_data.pop('equipamento')
        equipamento = Equipamento.objects.create(**equipamento_data)
        manutencao = Manutencao.objects.create(
            equipamento=equipamento, **validated_data
            )
        return manutencao
