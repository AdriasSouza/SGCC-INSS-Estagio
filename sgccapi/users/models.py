from django.db import models
from django.contrib.auth.models import AbstractUser
from equipamento.models import Equipamento


class Solicitacao(models.Model):
    id = models.BigAutoField()
    id_user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    descricao = models.CharField(max_length=255)


# Create your models here.
class User(AbstractUser):
    name = models.CharField(max_length=255)
    cpf = models.CharField(max_length=11, unique=True)
    password = models.CharField(max_length=255)
    id_servidor = models.ForeignKey(Servidor, on_delete=models.CASCADE)
    username = None 

    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELDS = []


class Servidor(models.Model):
    id = models.BigAutoField()
    codigo = models.CharField(max_length=255)
    nome_completo = models.CharField(max_length=255)


class Agencia(models.Model):
    id = models.BigAutoField()
    codigo_agencia = models.CharField(max_length=255)
    descricao = models.CharField(max_length=255)


class Setor(models.Model):
    id = models.BigAutoField()
    codigo = models.CharField(max_length=255)
    nome_setor = models.CharField(max_length=255)
    id_agencia = models.ForeignKey(Agencia, on_delete=models.CASCADE)
    id_servidor = models.ForeignKey(Servidor, on_delete=models.CASCADE)