from rest_framework.views import APIView  # Para criar views baseadas em classes
from rest_framework.response import Response  # Para enviar respostas HTTP
from rest_framework import status  # Constantes de status HTTP
from rest_framework.exceptions import AuthenticationFailed  # Exceção de autenticação
from rest_framework.permissions import IsAuthenticated  # Importa permissão
from django_filters.rest_framework import DjangoFilterBackend  # Importa filtro
from rest_framework import viewsets  # ViewSet para CRUD automático
from .serializers import (  # Importa os serializers necessários
    AgenciaSerializer,
    SetorSerializer,
    ServidorSerializer,
    UserSerializer,
    SolicitacaoSerializer,
)
from .models import User, Servidor, Agencia, Setor, Solicitacao
import jwt  # Biblioteca para manipulação de JSON Web Tokens
import datetime  # Para manipulação de datas e tempos


# View para registrar novos usuários
class RegisterView(APIView):
    def post(self, request):
        # Captura a flag de superusuário, se enviada
        is_superuser = request.data.get('is_superuser', False)
        # Valida os dados usando o serializer de User
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Salva o novo usuário no banco de dados
        serializer.save(is_superuser=is_superuser)
        # Retorna os dados do usuário criado com status 201 (Criado)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# View para login de usuários
class LoginView(APIView):
    def post(self, request):
        # Captura email e senha fornecidos no request
        email = request.data['email']
        password = request.data['password']
        # Busca um usuário com o email fornecido
        user = User.objects.filter(email=email).first()

        if user is None:
            # Caso o usuário não exista, lança uma exceção de autenticação
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            # Verifica a senha, se for inválida, lança exceção de autenticação
            raise AuthenticationFailed('Incorrect password!')

        # Cria o payload do JWT com o ID do usuário e tempo de expiração
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        # Gera o token JWT
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()
        # Define um cookie HttpOnly com o token JWT
        response.set_cookie(key='jwt', value=token, httponly=True)
        # Retorna o token no corpo da resposta
        response.data = {
            'jwt': token
        }
        return response


# View para obter informações do usuário autenticado
class UserView(APIView):
    def get(self, request):
        # Recupera o token JWT dos cookies
        token = request.COOKIES.get('jwt')

        if not token:
            # Se o token não estiver presente, lança exceção de autenticação
            raise AuthenticationFailed('Unauthenticated!')

        try:
            # Decodifica o token para obter o payload
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            # Se o token expirou, lança exceção de autenticação
            raise AuthenticationFailed('Unauthenticated!')

        # Busca o usuário com o ID do payload
        user = User.objects.filter(id=payload['id']).first()
        # Serializa os dados do usuário e os retorna
        serializer = UserSerializer(user)
        return Response(serializer.data)


# View para logout de usuários
class LogoutView(APIView):
    def post(self, request):
        # Cria uma resposta e remove o cookie com o token JWT
        response = Response()
        response.delete_cookie('jwt')
        # Retorna uma mensagem de sucesso
        response.data = {
            'message': 'success'
        }
        return response


# ViewSet para CRUD de Agencias
class AgenciaViewSet(viewsets.ModelViewSet):
    queryset = Agencia.objects.all()  # Retorna todas as Agencias
    serializer_class = AgenciaSerializer  # Usa o serializer de Agencia
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['nome', 'numero']


# ViewSet para CRUD de Setores
class SetorViewSet(viewsets.ModelViewSet):
    queryset = Setor.objects.all()  # Retorna todos os Setores
    serializer_class = SetorSerializer  # Usa o serializer de Setor
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['nome', 'codigo', 'id_agencia']


# ViewSet para CRUD de Servidores
class ServidorViewSet(viewsets.ModelViewSet):
    queryset = Servidor.objects.all()  # Retorna todos os Servidores
    serializer_class = ServidorSerializer  # Usa o serializer de Servidor
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['inscricao_institucional',
                        ' nome_completo', 'setor']


# ViewSet para CRUD de Solicitações
class SolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = Solicitacao.objects.all()  # Retorna todas as Solicitações
    serializer_class = SolicitacaoSerializer  # Usa o serializer de Solicitacao
    permission_classes = [IsAuthenticated]  # Requer autenticação
    filter_backends = [DjangoFilterBackend]  # Ativa o filtro
    filterset_fields = ['user', 'data', 'descricao', 'estado']
