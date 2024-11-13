from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError


# Gerenciador personalizado para o modelo de usuário.
class UserManager(BaseUserManager):
    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        """
        Cria e retorna um usuário comum com o email e senha fornecidos.
        """
        if not email:
            raise ValueError('Email é obrigatório')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)  # Criptografa a senha
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Cria e retorna um superusuário com todos os privilégios.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superusuário deve ter is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superusuário deve ter is_superuser=True')

        return self.create_user(email, password, **extra_fields)


# Modelo de usuário customizado, com email como campo de login.
class User(AbstractUser):
    email = models.EmailField(unique=True)  # Email único para login
    password = models.CharField(max_length=255)  # Senha criptografada
    username = None  # Desabilita o campo username, email será usado
    servidor = models.ForeignKey(
        'Servidor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='usuarios'  # Acesso reverso: servidor.usuarios.all()
    )
    is_admin = models.BooleanField(default=False)  # Indica se o usuário é admin
    is_active = models.BooleanField(default=True)  # Indica se o usuário está ativo
    is_staff = models.BooleanField(default=False)  # Indica se o usuário é membro da staff
    is_superuser = models.BooleanField(default=False)  # Indica se o usuário é superusuário

    objects = UserManager()  # Define o gerenciador de usuário personalizado

    USERNAME_FIELD = 'email'  # Usa email como campo principal de login
    REQUIRED_FIELDS = []  # Nenhum campo extra obrigatório além do email

    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para manter a lógica da classe pai.
        """
        super().save(*args, **kwargs)
        # A senha é gerida pelo AbstractUser, então não precisa ser reconfigurada aqui.

    def __str__(self):
        return self.email  # Representação string do usuário

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'


# Modelo que representa uma agência, com nome e número únicos.
class Agencia(models.Model):
    nome = models.CharField(max_length=255, null=True, blank=True)  # Nome da agência
    numero = models.IntegerField(null=True, blank=True)  # Número da agência

    def __str__(self):
        return self.nome  # Retorna o nome da agência para exibição

    class Meta:
        verbose_name = 'Agência'
        verbose_name_plural = 'Agências'


# Modelo que representa um setor, que pertence a uma agência.
class Setor(models.Model):
    codigo = models.IntegerField(null=True, blank=True)  # Código do setor
    nome = models.CharField(max_length=255, null=True, blank=True)  # Nome do setor
    agencia = models.ForeignKey(
        Agencia,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='setores',  # Acesso reverso: agencia.setores.all()
    )
    servidores = models.ManyToManyField(
        'Servidor',
        related_name='setores_associados'
    )
    chefe = models.OneToOneField(
        'Servidor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='chefe_do_setor'  # Acesso reverso: servidor.chefe_do_setor
    )

    def clean(self):
        # Verifica se o chefe está na lista de servidores
        if self.chefe and self.chefe in self.servidores.all():
            raise ValidationError(f"O servidor {self.chefe.nome_completo} não pode ser tanto chefe quanto servidor no mesmo setor.")

    def save(self, *args, **kwargs):
        # Chama a validação do modelo antes de salvar
        self.full_clean()  # Chama o método clean() de forma explícita
        super().save(*args, **kwargs)  # Salva o modelo depois da validação

    def __str__(self):
        return f"{self.nome} - {self.codigo}" if self.codigo else self.nome

    class Meta:
        verbose_name = 'Setor'
        verbose_name_plural = 'Setores'


# Modelo que representa um servidor.
class Servidor(models.Model):
    inscricao_institucional = models.CharField(max_length=255)  # Inscrição institucional
    nome_completo = models.CharField(max_length=255)  # Nome completo do servidor

    def __str__(self):
        return self.nome_completo  # Representação string do servidor

    class Meta:
        verbose_name = 'Servidor'
        verbose_name_plural = 'Servidores'


# Modelo para representar uma solicitação feita por um usuário.
class Solicitacao(models.Model):
    STATUS_CHOICES = [
        ('ATENDIDO', 'Atendido'),
        ('ANALISE', 'Em análise'),
        ('NEGADO', 'Negado'),
        ('ENCAMINHADO', 'Encaminhado'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='solicitacoes'  # Acesso reverso: user.solicitacoes.all()
    )
    data = models.DateTimeField(auto_now_add=True)  # Data e hora de criação da solicitação
    status = models.CharField(
        max_length=255,
        choices=STATUS_CHOICES,
        default='ANALISE'
    )  # Status da solicitação
    descricao = models.CharField(max_length=255, blank=True, null=True)  # Descrição da solicitação
    justificativa = models.CharField(max_length=255, blank=True, null=True)  # Justificativa opcional

    def __str__(self):
        return f"Solicitação {self.id} - {self.user.email}"  # Representação string da solicitação

    class Meta:
        verbose_name = 'Solicitação'
        verbose_name_plural = 'Solicitações'
