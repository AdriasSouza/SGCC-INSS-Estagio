from rest_framework import serializers
from .models import Agencia, Setor, Servidor, User, Solicitacao


# Serializer para o modelo Agencia
class AgenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agencia  # Define o modelo como Agencia
        fields = ['id', 'nome', 'numero']  # Campos expostos no serializer


# Serializer para o modelo Setor
class SetorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setor  # Define o modelo como Setor
        fields = ['id', 'codigo', 'nome', 'id_agencia']  # Campos expostos


# Serializer para o modelo Servidor
class ServidorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servidor  # Define o modelo como Servidor
        fields = ['id', 'inscricao_institucional', 'nome_completo', 'setor']
        # Define os campos expostos

    def create(self, validated_data):
        # Cria uma nova instância de Servidor com os dados validados
        instance = self.Meta.model(**validated_data)
        instance.save()  # Salva a nova instância no banco de dados
        return instance  # Retorna a instância criada


# Serializer para o modelo User (usuário)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Define o modelo como User
        fields = ['id', 'email', 'password', 'id_servidor']  # Campos expostos
        extra_kwargs = {
            'password': {'write_only': True}  # Senha apenas gravável
        }

    def create(self, validated_data):
        # Remove a senha dos dados validados para tratá-la separadamente
        password = validated_data.pop('password', None)
        # Cria uma nova instância do usuário com os dados validados
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)  # Define a senha de forma segura
        instance.save()  # Salva a instância no banco de dados
        return instance  # Retorna o usuário criado

    def update(self, instance, validated_data):
        # Atualiza o email, se fornecido nos dados validados
        instance.email = validated_data.get('email', instance.email)

        # Se uma nova senha for fornecida, atualiza a senha
        password = validated_data.get('password')
        if password:
            instance.set_password(password)  # Atualiza a senha de forma segura

        # Atualiza o id_servidor, se fornecido
        instance.id_servidor = validated_data.get('id_servidor',
                                                  instance.id_servidor)
        instance.save()  # Salva a instância atualizada no banco de dados
        return instance  # Retorna o usuário atualizado


# Serializer para o modelo Solicitacao
class SolicitacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitacao  # Define o modelo como Solicitacao
        fields = ['id', 'user', 'data', 'descricao', 'estado']
        # Define os campos expostos

    def create(self, validated_data):
        # Cria uma nova instância de Solicitacao com os dados validados
        instance = self.Meta.model(**validated_data)
        instance.save()  # Salva a nova instância no banco de dados
        return instance  # Retorna a instância criada
