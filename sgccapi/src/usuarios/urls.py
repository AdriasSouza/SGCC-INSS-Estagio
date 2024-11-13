from django.urls import path, include
from django.contrib.auth import views as auth_view
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
    ExportServidoresCSVView,  # View para exportar CSV dos Servidores socorro
    UserAdminUpdateView,
    UserAdminDataView,
    UserDeleteView,
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
router.register(r'user_data_admin', UserAdminDataView)

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
    # Rota para admin obter informalções de qualquer usuario
    # path('user_data_admin/<int:pk>/', UserAdminDataView.as_view()),
    # Rota para update de usuario
    path('user_update/', UserUpdateView.as_view()),
    # Deletar usuarios
    path('user_delete/<int:pk>/', UserDeleteView.as_view()),
    # Atualiza um usuario em especifico
    path('user_update_admin/<int:pk>/', UserAdminUpdateView.as_view()),
    # Rota para logout de usuários
    path('logout/', LogoutView.as_view()),
    # Rota para exportar CSV de setores
    path('export-servidores-csv/', ExportServidoresCSVView.as_view()),
    # Inclui as rotas dos ViewSets gerados pelo roteador
    path('', include(router.urls)),
    # VIEWS PARA RESET DE SENHA - NÃO FUNCIONA (AINDA)
    # URL para solicitar o reset de senha
    path('reset_password/', auth_view.PasswordResetView.as_view()),
    # URL para enviar o email com o link de redefinição
    path('reset_password_done/', auth_view.PasswordResetDoneView.as_view()),
    # URL para confirmar a redefinição da senha através do link enviado por email
    path('reset/<uidb64>/<token>/', auth_view.PasswordResetConfirmView.as_view()),
    # URL para a conclusão do processo de redefinição de senha
    path('reset_password_complete/', auth_view.PasswordResetCompleteView.as_view()),
]
