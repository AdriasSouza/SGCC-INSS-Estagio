from django.db import models
from users.models import Setor


# MANUTENCAO
class Manutencao(models.Model):
    id = models.BigAutoField()
    id_equipamento = models.ForeignObject(Equipamento, on_delete=models.DO_NOTHING)
    descricao = models.CharField(max_length=255) 


# EQUIPAMENTO
class Equipamento(models.Model):
    id = models.BigAutoField()
    id_setor = models.ForeignKey(Setor, on_delete=models.DO_NOTHING)
    id_computador = models.ForeignKey(Computador, on_delete=models.DO_NOTHING)
    id_monitor = models.ForeignKey(Monitor, on_delete=models.DO_NOTHING)
    id_teclado = models.ForeignKey(Teclado, on_delete=models.DO_NOTHING)


# COMPUTADORES
class Computador(models.Model):
    id = models.BigAutoField()
    tombamento = models.CharField(max_length=255)
    fabricante = models.CharField(max_length=255)
    sistema_operacional = models.CharField(max_length=255)
    id_processador = models.ForeignKey(Processador, on_delete=models.DO_NOTHING)
    id_placamae = models.ForeignKey(Placa_mae, on_delete=models.DO_NOTHING)
    id_ram = models.ForeignKey(Memoria_ram, on_delete=models.DO_NOTHING)
    id_memoria = models.ForeignKey(Memoria_interna, on_delete=models.DO_NOTHING)


class Processador(models.Model):
    id = models.BigAutoField()
    descricao = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    fabricante = models.CharField(max_length=255)


class Memoria_ram(models.Model):
    id = models.BigAutoField()
    descricao = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    tamanho = models.CharField(max_length=255)


class Memoria_interna(models.Model):
    id = models.BigAutoField()
    descricao = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    fabricante = models.CharField(max_length=255)


class Placa_mae(models.Model):
    id = models.BigAutoField()
    descricao = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    fabricante = models.CharField(max_length=255)


# PERIFERICOS
class Monitor(models.Model):
    id = models.BigAutoField()
    descricao = models.CharField(max_length=255)
    tombamento = models.CharField(max_length=255)
    fabricante = models.CharField(max_length=255)


class Teclado(models.Model):
    id = models.BigAutoField()
    descricao = models.CharField(max_length=255)
    fabricante = models.CharField(max_length=255)