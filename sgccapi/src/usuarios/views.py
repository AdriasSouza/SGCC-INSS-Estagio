from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    SAFE_METHODS,
    BasePermission
)
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from rest_framework import viewsets
from .serializers import (
    AgenciaSerializer,
    SetorSerializer,
    ServidorSerializer,
    UserSerializer,
    SolicitacaoSerializer
)
from .models import Servidor, Agencia, Setor, Solicitacao, User
import csv


# Permissão personalizada que permite acesso somente a administradores ou leitura por todos
class IsAdminOrReadOnly(IsAuthenticated):
    def has_permission(self, request, view):
        # Verifica se o usuário é admin ou se a requisição é de leitura (GET, OPTIONS, HEAD)
        return bool(request.user and (request.user.is_staff or request.method in SAFE_METHODS))


# View para registrar novos usuários
class RegisterView(APIView):
    permission_classes = [IsAdminUser]  # Apenas administradores podem criar usuários

    def post(self, request):
        # Impede que usuários não administradores definam campos como is_superuser ou is_staff
        if 'is_superuser' in request.data or 'is_staff' in request.data:
            if not request.user.is_superuser:
                return Response({"detail": "Você não tem permissão para definir os campos de superusuário ou staff."}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Cria o novo usuário
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Retorna os dados do usuário criado
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Se houver erros, retorna os erros


# View para atualizar os dados do usuário logado
class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]  # Apenas usuários autenticados podem atualizar seus dados

    def put(self, request):
        user = request.user  # Obtém o usuário logado
        
        # Verifica se o usuário está tentando alterar campos proibidos como 'is_superuser' ou 'is_staff'
        if 'is_superuser' in request.data or 'is_staff' in request.data:
            if not user.is_superuser:
                return Response({"detail": "Você não tem permissão para alterar os campos de superusuário ou staff."},
                                status=status.HTTP_403_FORBIDDEN)
        
        serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # Atualiza o usuário
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Se houver erros, retorna os erros


# View para que administradores atualizem dados de outros usuários
class UserAdminUpdateView(APIView):
    permission_classes = [IsAuthenticated]  # Garante que apenas usuários autenticados possam atualizar

    def put(self, request, *args, **kwargs):
        try:
            # Encontra o usuário pelo ID fornecido
            usuario = User.objects.get(pk=kwargs['pk'])
            
            # Passa o request para o contexto ao instanciar o serializer
            serializer = UserSerializer(usuario, data=request.data, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()  # Atualiza os dados do usuário
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Se houver erros, retorna os erros
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)


# View para visualizar os dados do usuário logado ou todos os usuários se o parâmetro 'all' for verdadeiro
class UserDataView(APIView):
    permission_classes = [IsAuthenticated]  # Apenas usuários autenticados podem acessar

    def get(self, request):
        # Retorna apenas os dados do usuário logado
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserFilter(filters.FilterSet):
    email = filters.CharFilter(field_name='email', lookup_expr='icontains')  # Busca parcial por email
    servidor = filters.NumberFilter(field_name='servidor', lookup_expr='exact')  # Filtra pelo ID do servidor
    is_staff = filters.BooleanFilter(field_name='is_staff')
    is_superuser = filters.BooleanFilter(field_name='is_superuser')

    class Meta:
        model = User
        fields = ['email', 'servidor', 'is_staff', 'is_superuser']

# View para administradores visualizarem dados de um usuário específico
class UserAdminDataView(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]  # Apenas administradores podem acessar
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter


# View para logout do usuário, invalidando o refresh token
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Apenas usuários autenticados podem fazer logout

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]  # Obtém o refresh token da requisição
            token = RefreshToken(refresh_token)  # Cria o objeto RefreshToken
            token.blacklist()  # Coloca o token na blacklist, invalidando-o

            return Response(status=status.HTTP_205_RESET_CONTENT)  # Retorna o status 205 (reset do conteúdo)
        except KeyError:
            return Response({"detail": "Refresh token not provided."}, status=status.HTTP_400_BAD_REQUEST)  # Caso não forneça o token
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)  # Qualquer outro erro


# Filtros para a model Agencia
class AgenciaFilter(filters.FilterSet):
    nome = filters.CharFilter(lookup_expr='icontains')  # Filtro para buscar por nome com case-insensitive
    numero = filters.NumberFilter()  # Filtro para o número da agência

    class Meta:
        model = Agencia
        fields = ['nome', 'numero']


# Filtros para a model Setor
class SetorFilter(filters.FilterSet):
    codigo = filters.NumberFilter()  # Filtro para código
    nome = filters.CharFilter(lookup_expr='icontains')  # Filtro para nome com case-insensitive
    agencia = filters.ModelChoiceFilter(queryset=Agencia.objects.all())  # Filtro para a agência relacionada
    chefe = filters.ModelChoiceFilter(queryset=Servidor.objects.all(), required=False)  # Filtro para o chefe (servidor responsável)
    servidores = filters.ModelMultipleChoiceFilter(queryset=Servidor.objects.all(), required=False)  # Filtro para servidores relacionados ao setor

    class Meta:
        model = Setor
        fields = ['codigo', 'nome', 'agencia', 'chefe', 'servidores']


# Filtros para a model Servidor
class ServidorFilter(filters.FilterSet):
    inscricao_institucional = filters.CharFilter(lookup_expr='icontains')  # Filtro para inscrição institucional
    nome_completo = filters.CharFilter(lookup_expr='icontains')  # Filtro para nome completo

    class Meta:
        model = Servidor
        fields = ['inscricao_institucional', 'nome_completo']


# ViewSet para a model Agencia
class AgenciaViewSet(viewsets.ModelViewSet):
    queryset = Agencia.objects.all().order_by('id')
    serializer_class = AgenciaSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = AgenciaFilter


# ViewSet para a model Setor
class SetorViewSet(viewsets.ModelViewSet):
    queryset = Setor.objects.all().order_by('id')
    serializer_class = SetorSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = SetorFilter


# ViewSet para a model Servidor
class ServidorViewSet(viewsets.ModelViewSet):
    queryset = Servidor.objects.all().order_by('id')
    serializer_class = ServidorSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ServidorFilter


# ViewSet para a model Solicitacao
class SolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = Solicitacao.objects.all().order_by('id')
    serializer_class = SolicitacaoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'data', 'status', 'descricao']


# View para exportar dados dos servidores em formato CSV
class ExportServidoresCSVView(APIView):
    permission_classes = [IsAdminUser]  # Apenas administradores podem acessar

    def get(self, request):
        # Obtém o setor_id da requisição
        setor_id = request.query_params.get('setor_id')
        if not setor_id:
            return HttpResponse(status=400, content="Parâmetro 'setor_id' é obrigatório.")  # Retorna erro caso não tenha setor_id

        try:
            # Encontra o setor
            setor = Setor.objects.get(id=setor_id)
        except Setor.DoesNotExist:
            return HttpResponse(status=404, content="Setor não encontrado.")  # Se o setor não existir, retorna erro

        # Obtém todos os servidores do setor, incluindo o chefe
        servidores = Servidor.objects.filter(setores_associados=setor).order_by('id')

        # Identifica o chefe do setor
        chefe = setor.chefe

        # Cria uma lista de servidores com o chefe primeiro
        servidores_ordenados = [chefe] + [servidor for servidor in servidores if servidor != chefe]

        # Prepara o nome do arquivo, incluindo código e nome do setor
        nome_arquivo = f"servidores_{setor.codigo}_{setor.nome}.csv"

        # Prepara a resposta do CSV
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{nome_arquivo}"'

        writer = csv.DictWriter(response, fieldnames=['nome_completo', 'inscricao_institucional', 'chefe'])
        writer.writeheader()

        # Escreve os dados dos servidores no CSV
        for servidor in servidores_ordenados:
            writer.writerow({
                'nome_completo': servidor.nome_completo,
                'inscricao_institucional': servidor.inscricao_institucional,
                'chefe': 'Sim' if servidor == chefe else ''
            })

        return response
