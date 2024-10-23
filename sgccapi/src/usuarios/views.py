from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
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
import jwt
import csv
import datetime
# import os

# SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')


class RegisterView(APIView):
    def post(self, request):
        is_superuser = request.data.get('is_superuser', False)
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(is_superuser=is_superuser)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found!')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        # SECRET_KEY
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')   
        user = User.objects.filter(id=payload['id']).first()
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


class AgenciaViewSet(viewsets.ModelViewSet):
    queryset = Agencia.objects.all()
    serializer_class = AgenciaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nome', 'numero']


class SetorViewSet(viewsets.ModelViewSet):
    queryset = Setor.objects.all()
    serializer_class = SetorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['codigo', 'nome', 'agencia']


class ServidorViewSet(viewsets.ModelViewSet):
    queryset = Servidor.objects.all()
    serializer_class = ServidorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'inscricao_institucional', 'nome_completo', 'setor', 'chefe'
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
    