from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    SAFE_METHODS,
    BasePermission
    )
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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
from .models import User, Servidor, Agencia, Setor, Solicitacao
import csv
import datetime
# import os

# SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
    

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
    queryset = Agencia.objects.all()
    serializer_class = AgenciaSerializer
    permission_classes = [IsAdminUser | ReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nome', 'numero']


class SetorViewSet(viewsets.ModelViewSet):
    queryset = Setor.objects.all()
    serializer_class = SetorSerializer
    permission_classes = [IsAdminUser | ReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['codigo', 'nome', 'agencia']


class ServidorViewSet(viewsets.ModelViewSet):
    queryset = Servidor.objects.all()
    serializer_class = ServidorSerializer
    permission_classes = [IsAdminUser | ReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'inscricao_institucional', 'nome_completo', 'setor', 'usuario', 'chefe'
        ]


class SolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = Solicitacao.objects.all()
    serializer_class = SolicitacaoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'data', 'status', 'descricao']


class ExportServidoresCSVView(APIView):
    permission_classes = [IsAuthenticated]

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

        servidores = Servidor.objects.filter(setor=setor)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="servidores_setor_{setor_id}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Nome Completo', 'Inscrição Institucional', 'Chefe'])

        for servidor in servidores:
            writer.writerow([servidor.nome_completo, servidor.inscricao_institucional, servidor.chefe])

        return response
    