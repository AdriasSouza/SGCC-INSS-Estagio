from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import (
    TipoEquipamento,
    Equipamento,
    Manutencao,
    TipoComponente,
    Componente,
    EquipComponente,
    Servidor,
    Setor
)
from django.contrib.auth import get_user_model

User = get_user_model()  # Obtém o modelo de usuário customizado


class EquipamentoTests(APITestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(email='user@test.com', password='password123')
        self.setor = Setor.objects.create(nome='Setor Teste')
        self.tipo_equipamento = TipoEquipamento.objects.create(nome='Tipo Teste', descricao='Descrição do tipo')
        self.equipamento = Equipamento.objects.create(
            plaqueta='12345',
            nome='Equipamento Teste',
            marca='Marca Teste',
            estado='NOVO',
            situacao='EM_USO',
            sala=1,
            setor=self.setor,
            tipo=self.tipo_equipamento,
            data_aquisicao='2024-10-24'
        )
        self.client.login(email='user@test.com', password='password123')

    def test_create_equipamento(self):
        url = reverse('equipamento-list')
        data = {
            'plaqueta': '54321',
            'nome': 'Equipamento Novo',
            'marca': 'Nova Marca',
            'estado': 'BOM',
            'situacao': 'RESERVA',
            'sala': 2,
            'setor': self.setor.id,
            'tipo': self.tipo_equipamento.id,
            'data_aquisicao': '2024-10-20',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Equipamento.objects.count(), 2)

    def test_update_equipamento(self):
        url = reverse('equipamento-detail', args=[self.equipamento.id])
        data = {
            'plaqueta': '12345',
            'nome': 'Equipamento Atualizado',
            'marca': 'Marca Atualizada',
            'estado': 'ATENÇÃO',
            'situacao': 'MANUTENCAO',
            'sala': 1,
            'setor': self.setor.id,
            'tipo': self.tipo_equipamento.id,
            'data_aquisicao': '2024-10-22',
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.equipamento.refresh_from_db()
        self.assertEqual(self.equipamento.nome, 'Equipamento Atualizado')

    def test_delete_equipamento(self):
        url = reverse('equipamento-detail', args=[self.equipamento.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Equipamento.objects.count(), 0)

    def test_export_equipamentos_csv(self):
        url = reverse('export-equipamentos-csv')
        response = self.client.get(url, {'data_inicio': '2024-10-01', 'data_fim': '2024-10-30'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv')

# Similar structure for Manutencao, TipoEquipamento, TipoComponente, Componente, and EquipComponente tests

class ManutencaoTests(APITestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(email='user@test.com', password='password123')
        self.servidor = Servidor.objects.create(nome='Servidor Teste')
        self.equipamento = Equipamento.objects.create(
            plaqueta='12345',
            nome='Equipamento Teste',
            marca='Marca Teste',
            estado='NOVO',
            situacao='EM_USO',
            sala=1,
            data_aquisicao='2024-10-24'
        )
        self.client.login(email='user@test.com', password='password123')

    def test_create_manutencao(self):
        url = reverse('manutencao-list')
        data = {
            'codigo': 1,
            'data': '2024-10-24',
            'descricao': 'Manutenção de teste',
            'equipamento': self.equipamento.id,
            'responsavel': self.servidor.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_manutencao(self):
        manutencao = Manutencao.objects.create(
            codigo=1,
            data='2024-10-24',
            descricao='Manutenção de teste',
            equipamento=self.equipamento,
            responsavel=self.servidor
        )
        url = reverse('manutencao-detail', args=[manutencao.id])
        data = {
            'codigo': 1,
            'data': '2024-10-25',
            'descricao': 'Manutenção atualizada',
            'equipamento': self.equipamento.id,
            'responsavel': self.servidor.id
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_manutencao(self):
        manutencao = Manutencao.objects.create(
            codigo=1,
            data='2024-10-24',
            descricao='Manutenção de teste',
            equipamento=self.equipamento,
            responsavel=self.servidor
        )
        url = reverse('manutencao-detail', args=[manutencao.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_export_manutencao_csv(self):
        url = reverse('export-manutencao-csv')
        response = self.client.get(url, {'data_inicio': '2024-10-01', 'data_fim': '2024-10-30'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv')

# Continue similar test structures for TipoEquipamento, TipoComponente, Componente, and EquipComponente

class TipoEquipamentoTests(APITestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(email='user@test.com', password='password123')
        self.client.login(email='user@test.com', password='password123')

    def test_create_tipo_equipamento(self):
        url = reverse('tipoequipamento-list')
        data = {
            'nome': 'Tipo Teste',
            'descricao': 'Descrição do tipo teste'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_tipo_equipamento(self):
        tipo = TipoEquipamento.objects.create(nome='Tipo Teste', descricao='Descrição do tipo teste')
        url = reverse('tipoequipamento-detail', args=[tipo.id])
        data = {
            'nome': 'Tipo Atualizado',
            'descricao': 'Descrição atualizada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_tipo_equipamento(self):
        tipo = TipoEquipamento.objects.create(nome='Tipo Teste', descricao='Descrição do tipo teste')
        url = reverse('tipoequipamento-detail', args=[tipo.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

# Similar structure for TipoComponente, Componente, and EquipComponente tests

class TipoComponenteTests(APITestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(email='user@test.com', password='password123')
        self.client.login(email='user@test.com', password='password123')

    def test_create_tipo_componente(self):
        url = reverse('tipocomponente-list')
        data = {
            'nome': 'Tipo Componente Teste',
            'descricao': 'Descrição do tipo componente teste'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_tipo_componente(self):
        tipo = TipoComponente.objects.create(nome='Tipo Componente Teste', descricao='Descrição do tipo componente teste')
        url = reverse('tipocomponente-detail', args=[tipo.id])
        data = {
            'nome': 'Tipo Componente Atualizado',
            'descricao': 'Descrição atualizada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_tipo_componente(self):
        tipo = TipoComponente.objects.create(nome='Tipo Componente Teste', descricao='Descrição do tipo componente teste')
        url = reverse('tipocomponente-detail', args=[tipo.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class ComponenteTests(APITestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(email='user@test.com', password='password123')
        self.tipo_componente = TipoComponente.objects.create(nome='Tipo Componente Teste', descricao='Descrição do tipo componente teste')
        self.client.login(email='user@test.com', password='password123')

    def test_create_componente(self):
        url = reverse('componente-list')
        data = {
            'nome': 'Componente Teste',
            'descricao': 'Descrição do componente',
            'tipo': self.tipo_componente.id,
            'codigo': 'COMP-001'  # Adicionando o campo 'codigo'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_componente(self):
        componente = Componente.objects.create(
            nome='Componente Teste',
            descricao='Descrição do componente',
            tipo=self.tipo_componente,
            codigo='COMP-001'  # Adicionando o campo 'codigo'
        )
        url = reverse('componente-detail', args=[componente.id])
        data = {
            'nome': 'Componente Atualizado',
            'descricao': 'Descrição atualizada',
            'tipo': self.tipo_componente.id,
            'codigo': 'COMP-002'  # Atualizando o campo 'codigo'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_componente(self):
        componente = Componente.objects.create(
            nome='Componente Teste',
            descricao='Descrição do componente',
            tipo=self.tipo_componente,
            codigo='COMP-001'  # Adicionando o campo 'codigo'
        )
        url = reverse('componente-detail', args=[componente.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_export_componentes_csv(self):
        url = reverse('export-componentes-csv')
        response = self.client.get(url, {'data_inicio': '2024-10-01', 'data_fim': '2024-10-30'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv')


class EquipComponenteTests(APITestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(email='user@test.com', password='password123')
        self.tipo_componente = TipoComponente.objects.create(nome='Tipo Componente Teste', descricao='Descrição do tipo componente teste')
        self.componente = Componente.objects.create(nome='Componente Teste', descricao='Descrição do componente', tipo=self.tipo_componente)
        self.equipamento = Equipamento.objects.create(
            plaqueta='12345',
            nome='Equipamento Teste',
            marca='Marca Teste',
            estado='NOVO',
            situacao='EM_USO',
            sala=1,
            data_aquisicao='2024-10-24'
        )
        self.client.login(email='user@test.com', password='password123')

    def test_create_equip_componente(self):
        url = reverse('equipcomponente-list')
        data = {
            'equipamento': self.equipamento.id,
            'componente': self.componente.id,
            'quantidade': 5
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_equip_componente(self):
        equip_componente = EquipComponente.objects.create(
            equipamento=self.equipamento,
            componente=self.componente,
            quantidade=5
        )
        url = reverse('equipcomponente-detail', args=[equip_componente.id])
        data = {
            'equipamento': self.equipamento.id,
            'componente': self.componente.id,
            'quantidade': 10
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_equip_componente(self):
        equip_componente = EquipComponente.objects.create(
            equipamento=self.equipamento,
            componente=self.componente,
            quantidade=5
        )
        url = reverse('equipcomponente-detail', args=[equip_componente.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_export_equip_componentes_csv(self):
        url = reverse('export-equip-componentes-csv')
        response = self.client.get(url, {'data_inicio': '2024-10-01', 'data_fim': '2024-10-30'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv')
