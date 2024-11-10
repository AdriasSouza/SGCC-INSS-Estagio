from django.contrib import admin
from .models import Agencia, Setor, Servidor, User, Solicitacao

admin.site.register(Agencia)
admin.site.register(Setor)
admin.site.register(Servidor)
admin.site.register(User)
admin.site.register(Solicitacao)
