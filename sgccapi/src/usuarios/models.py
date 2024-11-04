from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


# Modelo que representa uma agência, com nome e número únicos.
class Agencia(models.Model):
    # Nome da agência
    nome = models.CharField(max_length=255, null=True, blank=True)
    # Número da agência
    numero = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.nome  # Retorna o nome da agência para exibição

    class Meta:
        verbose_name = 'Agência'
        verbose_name_plural = 'Agências'


# Modelo que representa um setor, que pertence a uma agência.
class Setor(models.Model):
    # Código do setor
    codigo = models.IntegerField(null=True, blank=True)
    # Nome do setor
    nome = models.CharField(max_length=255, null=True, blank=True)
    # Relaciona o setor com uma agência. Se a agência for deletada,
    # o setor também será.
    agencia = models.ForeignKey(
        Agencia, on_delete=models.CASCADE, null=True, blank=True
        )

    def __str__(self):
        return f"{self.nome} - {self.codigo}" if self.codigo else self.nome

    class Meta:
        verbose_name = 'Setor'
        verbose_name_plural = 'Setores'


# Gerenciador personalizado para o modelo de usuário.
class UserManager(BaseUserManager):

    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is Required')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff = True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser = True')

        return self.create_user(email, password, **extra_fields)
    

class Servidor(models.Model):
    inscricao_institucional = models.CharField(max_length=255)
    nome_completo = models.CharField(max_length=255)
    setor = models.ForeignKey(
        Setor, on_delete=models.SET_NULL, blank=True, null=True
        )
    chefe = models.BooleanField(default=False)

    def __str__(self):
        return self.nome_completo

    class Meta:
        verbose_name = 'Servidor'
        verbose_name_plural = 'Servidores'


# Modelo de usuário customizado, com email como campo de login.
class User(AbstractUser):
    email = models.EmailField(unique=True)  # Email único para login
    # Relaciona o usuário a um servidor. Pode ser nulo.
    password = models.CharField(max_length=255)
    username = None  # Desabilita o campo username, email será usado
    servidor = models.ForeignKey(
        Servidor, on_delete=models.SET_NULL, null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = UserManager()  # Define o gerenciador de usuário personalizado

    USERNAME_FIELD = 'email'  # Usa email como campo principal de login
    REQUIRED_FIELDS = []  # Nenhum campo extra obrigatório além do email

    # Sobrescreve o método save para manter a lógica da classe pai
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # O password é gerido pelo AbstractUser, então não precisa ser
        # reconfigurado aqui.

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'


# Modelo para representar uma solicitação feita por um usuário.
class Solicitacao(models.Model):
    # Relaciona a solicitação a um usuário. A remoção do usuário não
    # apaga a solicitação.
    STATUS_CHOICES = [
        ('ATENDIDO', 'Atendido'),
        ('ANALISE', 'Em analise'),
        ('NEGADO', 'Negado'),
        ('ENCAMINHADO', 'Encaminhado'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True
        )
    # Armazena a data e hora em que a solicitação foi criada.
    data = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=255, choices=STATUS_CHOICES, default='ANALISE'
        )
    # Descrição da solicitação
    descricao = models.CharField(max_length=255)
    justificativa = models.CharField(max_length=255)

    def __str__(self):
        return f"Solicitação {self.id} - {self.user.email}"

    class Meta:
        verbose_name = 'Solicitação'
        verbose_name_plural = 'Solicitações'
