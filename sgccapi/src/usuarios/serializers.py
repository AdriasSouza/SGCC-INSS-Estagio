from rest_framework import serializers
from .models import Agencia, Setor, Servidor, User, Solicitacao


# Serializer para o modelo Agencia, que representa uma agência com nome e número identificador.
class AgenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agencia
        fields = ['id', 'nome', 'numero']  # Inclui o ID, nome e número no serializer.


# Serializer para o modelo Setor, que representa um setor dentro de uma agência.
class SetorSerializer(serializers.ModelSerializer):
    # Campo que representa o relacionamento com uma agência, usando apenas o ID da agência.
    agencia = serializers.PrimaryKeyRelatedField(
        queryset=Agencia.objects.all(), required=False, allow_null=True
    )
    # Campo que representa o relacionamento com o chefe do setor (servidor responsável).
    chefe = serializers.PrimaryKeyRelatedField(
        queryset=Servidor.objects.all(), required=False, allow_null=True
    )
    # Campo que representa os servidores associados ao setor (muitos para muitos).
    servidores = serializers.PrimaryKeyRelatedField(
        queryset=Servidor.objects.all(), many=True, required=False, allow_null=True
    )

    class Meta:
        model = Setor
        fields = ['id', 'codigo', 'nome', 'agencia','servidores', 'chefe']  # Inclui o ID, código, nome, agência e chefe.

    def create(self, validated_data):
        servidores_data = validated_data.pop('servidores', [])
        setor = Setor.objects.create(**validated_data)
        setor.servidores.set(servidores_data)
        return setor

    def update(self, instance, validated_data):
        servidores_data = validated_data.pop('servidores', [])
        instance.codigo = validated_data.get('codigo', instance.codigo)
        instance.nome = validated_data.get('nome', instance.nome)
        instance.agencia = validated_data.get('agencia', instance.agencia)
        instance.chefe = validated_data.get('chefe', instance.chefe)
        instance.save()
        instance.servidores.set(servidores_data)
        return instance

    # Sobrescreve a representação para exibir dados completos de agência e chefe ao invés de apenas os IDs.
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['agencia'] = AgenciaSerializer(instance.agencia).data if instance.agencia else None
        representation['chefe'] = ServidorSerializer(instance.chefe).data if instance.chefe else None
        representation['servidores'] = ServidorSerializer(instance.servidores.all(), many=True).data
        return representation


# Serializer para o modelo Servidor, que representa um servidor com seus dados pessoais e setor.
class ServidorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servidor
        fields = ['id', 'inscricao_institucional', 'nome_completo']  # Inclui apenas os campos do Servidor.


# Serializer para o modelo User, que representa um usuário do sistema.
class UserSerializer(serializers.ModelSerializer):
    # Campo que representa o relacionamento com um servidor, usando o ID do servidor.
    servidor = serializers.PrimaryKeyRelatedField(
        queryset=Servidor.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'is_active', 'is_staff', 'is_superuser', 'servidor']
        extra_kwargs = {
            'password': {'write_only': True},  # O campo password é write-only para não aparecer nas respostas.
        }

    # Validação para garantir que apenas superusuários possam modificar os campos de superusuário e staff.
    def validate(self, attrs):
        request = self.context.get('request')  # Pega o request do contexto

        if request and hasattr(request, 'user'):
            # Só tenta acessar o 'request.user' se o request for válido e tiver o atributo 'user'
            user = request.user
            if 'is_superuser' in attrs or 'is_staff' in attrs:
                if not user.is_superuser:
                    raise serializers.ValidationError("Você não tem permissão para alterar os campos de superusuário ou staff.")
        else:
            # Se não houver usuário autenticado, podemos ignorar essa validação
            pass

        return attrs

    # Método de criação customizado para definir a senha do usuário corretamente.
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)  # Define a senha usando o método adequado para segurança.
        user.save()
        return user

    # Método de atualização customizado para alterar a senha, se fornecida.
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)  # Atualiza a senha, se fornecida.
        return super().update(instance, validated_data)

    def to_internal_value(self, data):
        """
        Método customizado para tornar `email` e `password` opcionais durante a atualização (PUT).
        """
        # Se já houver uma instância (significa que é uma atualização), torna esses campos opcionais
        if self.instance:
            self.fields['email'].required = False
            self.fields['password'].required = False
        return super().to_internal_value(data)

    # Sobrescreve a representação para exibir dados completos do servidor ao invés de apenas o ID.
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['servidor'] = ServidorSerializer(instance.servidor).data if instance.servidor else None
        return representation


# Serializer para o modelo Solicitacao, que representa uma solicitação feita por um usuário.
class SolicitacaoSerializer(serializers.ModelSerializer):
    # Campo que representa o relacionamento com o usuário solicitante, usando o ID do usuário.
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Solicitacao
        fields = ['id', 'user', 'data', 'status', 'descricao', 'justificativa'] # Inclui ID, usuário, data, status, descrição e justificativa.

    # Sobrescreve a representação para exibir dados completos do usuário ao invés de apenas o ID.
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = UserSerializer(instance.user).data
        return representation
