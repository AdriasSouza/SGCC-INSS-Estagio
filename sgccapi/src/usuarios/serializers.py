from rest_framework import serializers
from .models import Agencia, Setor, Servidor, User, Solicitacao


class AgenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agencia
        fields = ['id', 'nome', 'numero']


class SetorSerializer(serializers.ModelSerializer):
    agencia = serializers.PrimaryKeyRelatedField(
        queryset=Agencia.objects.all()
        )
    
    class Meta:
        model = Setor
        fields = ['id', 'codigo', 'nome', 'agencia']


class ServidorSerializer(serializers.ModelSerializer):
    setor = serializers.PrimaryKeyRelatedField(queryset=Setor.objects.all())
    usuario = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = Servidor
        fields = ['id', 'inscricao_institucional',
                  'nome_completo', 'setor', 'usuario', 'chefe']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        instance.id_servidor = validated_data.get(
            'id_servidor', instance.id_servidor
            )
        instance.save()
        return instance


class SolicitacaoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = Solicitacao
        fields = ['id', 'user', 'data', 'status', 'descricao']
