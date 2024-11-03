from rest_framework import serializers
from .models import Agencia, Setor, Servidor, User, Solicitacao


class AgenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agencia
        fields = ['id', 'nome', 'numero']


class SetorSerializer(serializers.ModelSerializer):
    # Aninha o serializer de Agência com read_only=True para retorno do objeto completo
    agencia = AgenciaSerializer(read_only=True)

    class Meta:
        model = Setor
        fields = ['id', 'codigo', 'nome', 'agencia']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create(email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)


class ServidorSerializer(serializers.ModelSerializer):
    # Aninha os serializers de Setor e User com read_only=True para retorno dos objetos completos
    setor = SetorSerializer(read_only=True)
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = Servidor
        fields = ['id', 'inscricao_institucional', 'nome_completo', 'setor', 'usuario', 'chefe']


class SolicitacaoSerializer(serializers.ModelSerializer):
    # Aninha o serializer de User com read_only=True para retorno do objeto completo
    user = UserSerializer(read_only=True)

    class Meta:
        model = Solicitacao
        fields = ['id', 'user', 'data', 'status', 'descricao']
