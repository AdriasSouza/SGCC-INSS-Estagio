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
    # Método para criar um usuário comum.
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email deve ser fornecido")
        email = self.normalize_email(email)  # Normaliza o email
        user = self.model(email=email, **extra_fields)  # Cria a instância
        user.set_password(password)  # Define a senha
        user.save(using=self._db)  # Salva o usuário no banco
        return user

    # Método para criar um superusuário.
    def create_superuser(self, email, password=None, **extra_fields):
        # Define permissões de staff e superusuário
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


# Modelo de usuário customizado, com email como campo de login.
class User(AbstractUser):
    email = models.EmailField(unique=True)  # Email único para login
    # Relaciona o usuário a um servidor. Pode ser nulo.
    password = models.CharField(max_length=255)
    username = None  # Desabilita o campo username, email será usado
    
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


# Modelo que representa um servidor, ligado a um setor.
class Servidor(models.Model):
    inscricao_institucional = models.CharField(max_length=255)
    nome_completo = models.CharField(max_length=255)
    # Relaciona o servidor com um setor. Se o setor for deletado, o campo
    # será nulo.
    usuario = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True
        )
    setor = models.ForeignKey(
        Setor, on_delete=models.SET_NULL, blank=True, null=True
        )
    chefe = models.BooleanField(default=False)

    def __str__(self):
        return self.nome_completo

    class Meta:
        verbose_name = 'Servidor'
        verbose_name_plural = 'Servidores'


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

    def __str__(self):
        return f"Solicitação {self.id} - {self.user.email}"

    class Meta:
        verbose_name = 'Solicitação'
        verbose_name_plural = 'Solicitações'
