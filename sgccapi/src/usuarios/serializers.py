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
        user = UserData.objects.create(email=validated_data['email'],
                                       name=validated_data['name']
                                         )
        user.set_password(validated_data['password'])
        user.save()
        return user
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)

class SolicitacaoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = Solicitacao
        fields = ['id', 'user', 'data', 'status', 'descricao']
