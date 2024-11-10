from django.contrib import admin
from .models import Equipamento, Componente, TipoComponente, TipoEquipamento, Manutencao

admin.site.register(TipoEquipamento)
admin.site.register(TipoComponente)
admin.site.register(Equipamento)
admin.site.register(Componente)
admin.site.register(Manutencao)