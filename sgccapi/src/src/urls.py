from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuarios/', include('usuarios.urls')),
    path('api/gerenciamento/', include('equipamentos.urls'))
    # path('api/equipamentos/', include('equipamentos.urls')),
]
