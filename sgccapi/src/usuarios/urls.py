from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AgenciaViewSet,   # ViewSet para o modelo Agencia
    SetorViewSet,     # ViewSet para o modelo Setor
    ServidorViewSet,  # ViewSet para o modelo Servidor
    SolicitacaoViewSet,  # ViewSet para o modelo Solicitacao
    RegisterView,     # View para registrar novos usuários
    UserUpdateView,    # View para dar update nas informações do usuario
    UserDataView,         # View para obter informações do usuário logado
    LogoutView,       # View para logout de usuários
    ExportServidoresCSVView  # View para exportar CSV dos Servidores socorro
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
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
    path('register/', RegisterView.as_view()),
    # Rota para login de usuários
    path('login/', TokenObtainPairView.as_view()),
    # Rota para dar refresh no token
    path('login/refresh/', TokenRefreshView.as_view()),
    # Rota para obter informações do usuário logado
    path('user_data/', UserDataView.as_view()),
    # Rota para update de usuario
    path('user_update/', UserUpdateView.as_view()),
    # Rota para logout de usuários
    path('logout/', LogoutView.as_view()),
    # Rota para exportar CSV de setores
    path('export-servidores-csv/', ExportServidoresCSVView.as_view()),
    # Inclui as rotas dos ViewSets gerados pelo roteador
    path('', include(router.urls)),
]
