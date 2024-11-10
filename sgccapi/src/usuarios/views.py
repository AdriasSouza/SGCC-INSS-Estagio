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


class RegisterView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        # Verifique se o usuário está tentando registrar com campos de 'is_superuser' ou 'is_staff'
        if 'is_superuser' in request.data or 'is_staff' in request.data:
            if not request.user.is_superuser:
                return Response({"detail": "Você não tem permissão para definir os campos de superusuário ou staff."},
                                 status=status.HTTP_403_FORBIDDEN)
        
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        
        # Verifique se o usuário está tentando alterar os campos 'is_superuser' ou 'is_staff'
        if 'is_superuser' in request.data or 'is_staff' in request.data:
            if not user.is_superuser:
                return Response({"detail": "Você não tem permissão para alterar os campos de superusuário ou staff."},
                                status=status.HTTP_403_FORBIDDEN)
        
        # Passando o contexto com o 'request' para o serializer
        serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAdminUpdateView(APIView):
    permission_classes = [IsAuthenticated]  # Garante que apenas usuários autenticados possam atualizar

    def put(self, request, *args, **kwargs):
        try:
            # Encontrar o usuário pelo id
            usuario = User.objects.get(pk=kwargs['pk'])
            
            # Passar o request no contexto ao instanciar o serializer
            serializer = UserSerializer(usuario, data=request.data, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)


class UserDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Verifica se o parâmetro 'all' está presente e é verdadeiro na URL
        get_all = request.query_params.get('all', 'false').lower() == 'true'
        
        if get_all:
            # Retorna todos os usuários
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        else:
            # Retorna apenas os dados do usuário logado
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data)
        

class UserAdminDataView(APIView):
    permission_classes = [IsAdminUser]  # Apenas administradores podem acessar

    def get(self, request, pk):
        try:
            # Tente encontrar o usuário pelo ID
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Serializa os dados do usuário
        serializer = UserSerializer(user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]  # Obtenha o refresh token do corpo da requisição
            token = RefreshToken(refresh_token)  # Crie um objeto RefreshToken
            token.blacklist()  # Coloque o token na blacklist

            return Response(status=status.HTTP_205_RESET_CONTENT)  # Retorne o status 205
        except KeyError:
            return Response({"detail": "Refresh token not provided."}, status=status.HTTP_400_BAD_REQUEST)  # Caso não forneça o token
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)  # Retorne a mensagem de errocd
    

# Filtros para a model Agencia
class AgenciaFilter(filters.FilterSet):
    nome = filters.CharFilter(lookup_expr='icontains')
    numero = filters.NumberFilter()

    class Meta:
        model = Agencia
        fields = ['nome', 'numero']


# Filtros para a model Setor
class SetorFilter(filters.FilterSet):
    codigo = filters.NumberFilter()
    nome = filters.CharFilter(lookup_expr='icontains')
    agencia = filters.ModelChoiceFilter(queryset=Agencia.objects.all())

    class Meta:
        model = Setor
        fields = ['codigo', 'nome', 'agencia']


# Filtros para a model Servidor
class ServidorFilter(filters.FilterSet):
    inscricao_institucional = filters.CharFilter(lookup_expr='icontains')
    nome_completo = filters.CharFilter(lookup_expr='icontains')
    setor = filters.ModelChoiceFilter(queryset=Setor.objects.all())

    class Meta:
        model = Servidor
        fields = ['inscricao_institucional', 'nome_completo', 'setor']


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class AgenciaViewSet(viewsets.ModelViewSet):
    queryset = Agencia.objects.all().order_by('id')
    serializer_class = AgenciaSerializer
    permission_classes = [IsAuthenticated]
    # permission_classes = [IsAdminUser | ReadOnly]
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nome', 'numero']


class SetorViewSet(viewsets.ModelViewSet):
    queryset = Setor.objects.all().order_by('id')
    serializer_class = SetorSerializer
    permission_classes = [IsAuthenticated]
    # permission_classes = [IsAdminUser | ReadOnly]
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['codigo', 'nome', 'agencia']


class ServidorViewSet(viewsets.ModelViewSet):
    queryset = Servidor.objects.all().order_by('id')
    serializer_class = ServidorSerializer
    permission_classes = [IsAuthenticated]
    permission_classes = [IsAdminUser | ReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'inscricao_institucional', 'nome_completo', 'setor', 'chefe'
        ]


class SolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = Solicitacao.objects.all().order_by('id')
    serializer_class = SolicitacaoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'data', 'status', 'descricao']


class ExportServidoresCSVView(APIView):
    permission_classes = [IsAuthenticated]
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        setor_id = request.query_params.get('setor_id')
        if not setor_id:
            return HttpResponse(
                status=400, content="Parâmetro 'setor_id' é obrigatório."
                )
        try:
            setor = Setor.objects.get(id=setor_id)
        except Setor.DoesNotExist:
            return HttpResponse(status=404, content="Setor não encontrado.")

        servidores = Servidor.objects.filter(setor=setor).order_by('id')

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="servidores_setor_{setor_id}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Nome Completo', 'Inscrição Institucional', 'Chefe'])

        for servidor in servidores:
            writer.writerow([servidor.nome_completo, servidor.inscricao_institucional, servidor.chefe])

        return response
    