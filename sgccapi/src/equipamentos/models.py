from django.db import models  # Importa o módulo models do Django
from usuarios.models import Servidor  # Importa o modelo Servidor de outro app


# Modelo para representar os tipos de equipamentos
class TipoEquipamento(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.CharField(max_length=255, blank=True, null=True)

    # Retorna o nome do tipo de equipamento para facilitar a visualização
    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = 'Tipo de Equipamento'
        verbose_name_plural = 'Tipos de Equipamentos'


# Modelo para representar os equipamentos
class Equipamento(models.Model):

    ESTADO_CHOICES = [
        ('DEFASADO', 'Defasado'),
        ('ATENÇÃO', 'Atenção'),
        ('BOM', 'Boas condições'),
        ('NOVO', 'Como novo'),
    ]

    SITUACAO_CHOICES = [
        ('EM_USO', 'Em uso'),
        ('RESERVA', 'Na reserva'),
        ('MANUTENCAO', 'Em manutenção'),
        ('BAIXA', 'Deu baixa'),
        ('ALIENACAO', 'Transferido'),
        ('PERDIDO', 'Perdido'),
        ('ROUBADO', 'Roubado'),
    ]

    plaqueta = models.CharField(max_length=255, null=True, blank=True)
    nome = models.CharField(max_length=255, null=True, blank=True)
    marca = models.CharField(max_length=255, null=True, blank=True)
    estado = models.CharField(
        max_length=255, choices=ESTADO_CHOICES, default='NOVO'
        )
    situacao = models.CharField(
        max_length=255, choices=SITUACAO_CHOICES, default='EM_USO'
        )
    sala = models.IntegerField(null=True, blank=True)
    # Relaciona com TipoEquipamento, sem excluir o tipo caso ele seja removido
    tipo = models.ForeignKey(
        TipoEquipamento, on_delete=models.DO_NOTHING, null=True, blank=True
    )
    # Relaciona com Servidor, definindo um valor padrão
    # caso o servidor seja removido
    servidor = models.ForeignKey(
        Servidor, on_delete=models.SET_NULL, null=True, blank=True
    )

    # Retorna o nome do equipamento com a plaqueta para
    # facilitar a identificação
    def __str__(self):
        return f'{self.nome} ({self.plaqueta})' if self.nome else self.plaqueta

    class Meta:
        verbose_name = 'Equipamento'
        verbose_name_plural = 'Equipamentos'


# Modelo para registrar manutenções dos equipamentos
class Manutencao(models.Model):
    codigo = models.IntegerField(null=True, blank=True)
    data_inicio = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    data_fim = models.DateField(blank=True, null=True)
    descricao = models.CharField(max_length=255, null=True, blank=True)
    # Relaciona com Equipamento, excluindo manutenção
    # caso o equipamento seja removido
    equipamento = models.ForeignKey(
        Equipamento, on_delete=models.CASCADE, null=True, blank=True
    )
    # Relaciona com Servidor e exclui o registro se o servidor for removido
    responsavel = models.ForeignKey(
        Servidor, on_delete=models.CASCADE, null=True, blank=True
    )

    # Retorna o código da manutenção e o equipamento associado
    def __str__(self):
        return f'Manutenção {self.codigo} - {self.equipamento}'

    class Meta:
        verbose_name = 'Manutenção'
        verbose_name_plural = 'Manutenções'
