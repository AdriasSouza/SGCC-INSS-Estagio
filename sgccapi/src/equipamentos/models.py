from django.db import models  # Importa o módulo models do Django
from usuarios.models import Servidor, Setor  # Importa o modelo Servidor


# Modelo para representar os tipos de equipamentos
class TipoEquipamento(models.Model):
    nome = models.CharField(max_length=255)  # Nome do tipo de equipamento
    descricao = models.CharField(max_length=255, blank=True, null=True)  # Descrição opcional

    def __str__(self):
        return self.nome  # Retorna o nome do tipo de equipamento para facilitar a visualização

    class Meta:
        verbose_name = 'Tipo de Equipamento'  # Nome singular para o tipo de equipamento
        verbose_name_plural = 'Tipos de Equipamentos'  # Nome plural para tipos de equipamentos


# Modelo para representar os tipos de componentes
class TipoComponente(models.Model):
    nome = models.CharField(max_length=255)  # Nome do tipo de componente
    descricao = models.CharField(max_length=255)  # Descrição do tipo de componente

    def __str__(self):
        return f'Tipo de componente {self.nome} - {self.descricao}'

    class Meta:
        verbose_name = 'Tipo de Componente'  # Nome singular para o tipo de componente
        verbose_name_plural = 'Tipos de Componentes'  # Nome plural para tipos de componentes


# Modelo para representar os componentes de equipamentos
class Componente(models.Model):
    codigo = models.CharField(max_length=255)  # Código identificador do componente
    nome = models.CharField(max_length=255)  # Nome do componente
    descricao = models.CharField(max_length=255)  # Descrição do componente
    tipo = models.ForeignKey(
        TipoComponente, on_delete=models.SET_NULL, blank=True, null=True, related_name='componentes'  # Relaciona com o tipo de componente
    )
    fabricante = models.CharField(max_length=255)  # Nome do fabricante do componente
    tamanho_mem = models.IntegerField(blank=True, null=True)  # Tamanho da memória do componente, se aplicável
    n_serie = models.CharField(max_length=255, blank=True, null=True)  # Número de série do componente
    data_aquisicao = models.DateField(auto_now=False, auto_now_add=False)  # Data de aquisição do componente

    def __str__(self):
        return f'Componente {self.nome} - {self.tipo}'  # Representação do componente

    class Meta:
        verbose_name = 'Componente'  # Nome singular para o componente
        verbose_name_plural = 'Componentes'  # Nome plural para os componentes


# Modelo para representar os equipamentos
class Equipamento(models.Model):

    # Escolhas para o estado do equipamento
    ESTADO_CHOICES = [
        ('DEFASADO', 'Defasado'),
        ('ATENÇÃO', 'Atenção'),
        ('BOM', 'Boas condições'),
        ('NOVO', 'Como novo'),
    ]

    # Escolhas para a situação do equipamento
    SITUACAO_CHOICES = [
        ('EM_USO', 'Em uso'),
        ('RESERVA', 'Na reserva'),
        ('MANUTENCAO', 'Em manutenção'),
        ('BAIXA', 'Deu baixa'),
        ('ALIENACAO', 'Transferido'),
        ('PERDIDO', 'Perdido'),
        ('ROUBADO', 'Roubado'),
    ]

    plaqueta = models.CharField(max_length=255, null=True, blank=True, db_index=True)  # Identificação do equipamento
    nome = models.CharField(max_length=255, null=True, blank=True)  # Nome do equipamento
    marca = models.CharField(max_length=255, null=True, blank=True)  # Marca do equipamento
    estado = models.CharField(
        max_length=255, choices=ESTADO_CHOICES, default='NOVO'  # Estado do equipamento
    )
    situacao = models.CharField(
        max_length=255, choices=SITUACAO_CHOICES, default='EM_USO'  # Situação do equipamento
    )
    sala = models.IntegerField(null=True, blank=True)  # Número da sala onde o equipamento se encontra
    setor = models.ForeignKey(
        Setor, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipamentos'  # Relaciona o equipamento com o setor
    )
    tipo = models.ForeignKey(
        TipoEquipamento, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipamentos'  # Relaciona o equipamento com seu tipo
    )
    componentes = models.ManyToManyField(Componente, related_name='equipamentos')  # Relaciona o equipamento com múltiplos componentes
    servidor_responsavel = models.ForeignKey(
        Servidor, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipamentos_responsaveis'  # Servidor responsável pelo equipamento
    )
    data_aquisicao = models.DateField(
        auto_now=False, auto_now_add=False, null=True  # Data de aquisição do equipamento
    )

    def __str__(self):
        # Retorna o nome do equipamento com a plaqueta para facilitar a identificação
        return f'{self.nome} ({self.plaqueta})' if self.nome else self.plaqueta

    class Meta:
        verbose_name = 'Equipamento'  # Nome singular para o equipamento
        verbose_name_plural = 'Equipamentos'  # Nome plural para os equipamentos


# Modelo para registrar manutenções dos equipamentos
class Manutencao(models.Model):
    codigo = models.CharField(max_length=255, blank=True, null=True)  # Código de identificação da manutenção
    data = models.DateField(
        auto_now_add=False, auto_now=False, blank=True, null=True  # Data da manutenção
    )
    descricao = models.CharField(max_length=255, null=True, blank=True)  # Descrição do serviço de manutenção
    equipamento = models.ForeignKey(
        Equipamento, on_delete=models.SET_NULL, null=True, blank=True, related_name='manutencoes'  # Equipamento relacionado à manutenção
    )
    responsavel = models.ForeignKey(
        Servidor, on_delete=models.SET_NULL, null=True, blank=True, related_name='manutencoes'  # Servidor responsável pela manutenção
    )

    def __str__(self):
        # Retorna a descrição da manutenção e o equipamento associado
        return f'Manutenção {self.codigo} - {self.equipamento}'

    class Meta:
        verbose_name = 'Manutenção'  # Nome singular para a manutenção
        verbose_name_plural = 'Manutenções'  # Nome plural para manutenções
