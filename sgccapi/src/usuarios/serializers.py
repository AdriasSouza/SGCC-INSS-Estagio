from rest_framework import serializers
from .models import Agencia, Setor, Servidor, User, Solicitacao


class AgenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agencia
        fields = ['id', 'nome', 'numero']


class SetorSerializer(serializers.ModelSerializer):
    agencia = serializers.PrimaryKeyRelatedField(
        queryset=Agencia.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Setor
        fields = ['id', 'codigo', 'nome', 'agencia']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['agencia'] = AgenciaSerializer(instance.agencia).data if instance.agencia else None
        return representation


class ServidorSerializer(serializers.ModelSerializer):
    setor = serializers.PrimaryKeyRelatedField(
        queryset=Setor.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Servidor
        fields = ['id', 'inscricao_institucional',
                  'nome_completo', 'setor', 'chefe']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['setor'] = SetorSerializer(instance.setor).data if instance.setor else None
        return representation


class UserSerializer(serializers.ModelSerializer):
    servidor = serializers.PrimaryKeyRelatedField(
        queryset=Servidor.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'is_active',
                  'is_staff', 'is_superuser', 'servidor']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, attrs):
        # Verifique se os campos is_superuser ou is_staff foram passados
        user = self.context.get('request').user
        if 'is_superuser' in attrs or 'is_staff' in attrs:
            if not user.is_superuser:
                raise serializers.ValidationError("Você não tem permissão para alterar os campos de superusuário ou staff.")
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['servidor'] = ServidorSerializer(instance.servidor).data if instance.servidor else None
        return representation


class SolicitacaoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    # status = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Solicitacao
        fields = ['id', 'user', 'data', 'status', 'descricao', 'justificativa']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = UserSerializer(instance.user).data
        return representation
