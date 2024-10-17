from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AgenciaViewSet,   # ViewSet para o modelo Agencia
    SetorViewSet,     # ViewSet para o modelo Setor
    ServidorViewSet,  # ViewSet para o modelo Servidor
    SolicitacaoViewSet,  # ViewSet para o modelo Solicitacao
    RegisterView,     # View para registrar novos usuários
    LoginView,        # View para login de usuários
    UserView,         # View para obter informações do usuário logado
    LogoutView,       # View para logout de usuários
)

# Cria um roteador padrão que gerenciará automaticamente as URLs
router = DefaultRouter()

# Registra os ViewSets com suas rotas correspondentes
router.register(r'agencias', AgenciaViewSet)   # URL para Agencia
router.register(r'setores', SetorViewSet)      # URL para Setor
router.register(r'servidores', ServidorViewSet)  # URL para Servidor
router.register(r'solicitacoes', SolicitacaoViewSet)  # URL para Solicitacao

# Define as rotas de URL da aplicação
urlpatterns = [
    # Rota para registrar novos usuários
    path('api/register/', RegisterView.as_view(), name='register'),
    # Rota para login de usuários
    path('api/login/', LoginView.as_view(), name='login'),
    # Rota para obter informações do usuário logado
    path('api/user/', UserView.as_view(), name='user'),
    # Rota para logout de usuários
    path('api/logout/', LogoutView.as_view(), name='logout'),
    # Inclui as rotas dos ViewSets gerados pelo roteador
    path('api/', include(router.urls)),
]
