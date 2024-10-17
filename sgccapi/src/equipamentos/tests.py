from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Equipamento, TipoEquipamento, Manutencao
from usuarios.models import User, Servidor, Setor, Agencia


class EquipamentoTest(APITestCase):

    def setUp(self):
        # Criação de uma agência, setor e servidor
        self.agencia = Agencia.objects.create(nome="Agência Central", numero=101)
        self.setor = Setor.objects.create(nome="TI", codigo=12, id_agencia=self.agencia)
        self.servidor = Servidor.objects.create(inscricao_institucional="123456789", nome_completo="José Souza", setor=self.setor)
        
        # Criação de um usuário vinculado a um servidor
        self.user = User.objects.create_user(email="user1@test.com", password="password123", id_servidor=self.servidor)

        # Criação de um Tipo de Equipamento
        self.tipo_equipamento = TipoEquipamento.objects.create(nome="Computador", descricao="Desktop padrão")

        # Criação de um Equipamento
        self.equipamento = Equipamento.objects.create(
            plaqueta="PC-001",
            nome="Positivo Micro",
            marca="Positivo",
            estado="NOVO",
            situacao="EM_USO",
            sala=123,
            tipo=self.tipo_equipamento,
            servidor=self.servidor,
        )

        # Criação de um registro de manutenção
        self.manutencao = Manutencao.objects.create(
            equipamento=self.equipamento,
            codigo=456,
            data_inicio="2023-09-10",
            data_fim="2023-09-12",
            descricao="Substituição de memória RAM",
            responsavel=self.servidor
        )

    # Teste para criação de Tipo de Equipamento
    def test_create_tipo_equipamento(self):
        url = reverse('tipoequipamento-list')
        data = {
            'nome': 'Impressora',
            'descricao': 'Impressora multifuncional'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TipoEquipamento.objects.count(), 2)

    # Teste para visualização de um Tipo de Equipamento
    def test_view_tipo_equipamento(self):
        url = reverse('tipoequipamento-detail', args=[self.tipo_equipamento.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], self.tipo_equipamento.nome)

    # Teste para atualização de um Tipo de Equipamento
    def test_update_tipo_equipamento(self):
        url = reverse('tipoequipamento-detail', args=[self.tipo_equipamento.id])
        data = {'nome': 'Servidor', 'descricao': 'Servidor de arquivos'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tipo_equipamento.refresh_from_db()
        self.assertEqual(self.tipo_equipamento.nome, 'Servidor')

    # Teste para exclusão de um Tipo de Equipamento
    def test_delete_tipo_equipamento(self):
        url = reverse('tipoequipamento-detail', args=[self.tipo_equipamento.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TipoEquipamento.objects.count(), 0)

    # Teste para criação de Equipamento
    def test_create_equipamento(self):
        url = reverse('equipamento-list')
        data = {
            'codigo': 'PC-002',
            'tipo_equipamento': self.tipo_equipamento.id,
            'responsavel': self.servidor.id,
            'estado': 'Em manutenção'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Equipamento.objects.count(), 2)

    # Teste para visualização de um Equipamento
    def test_view_equipamento(self):
        url = reverse('equipamento-detail', args=[self.equipamento.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['codigo'], self.equipamento.codigo)

    # Teste para atualização de um Equipamento
    def test_update_equipamento(self):
        url = reverse('equipamento-detail', args=[self.equipamento.id])
        data = {
            'codigo': 'PC-003',
            'tipo_equipamento': self.tipo_equipamento.id,
            'responsavel': self.servidor.id,
            'estado': 'Desativado'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.equipamento.refresh_from_db()
        self.assertEqual(self.equipamento.codigo, 'PC-003')
        self.assertEqual(self.equipamento.estado, 'Desativado')

    # Teste para exclusão de um Equipamento
    def test_delete_equipamento(self):
        url = reverse('equipamento-detail', args=[self.equipamento.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Equipamento.objects.count(), 0)

    # Teste para criação de registro de Manutenção
    def test_create_manutencao(self):
        url = reverse('manutencao-list')
        data = {
            'equipamento': self.equipamento.id,
            'descricao': 'Limpeza interna',
            'data_inicio': '2023-10-01',
            'data_fim': '2023-10-02',
            'tecnico_responsavel': self.servidor.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Manutencao.objects.count(), 2)

    # Teste para visualização de um registro de Manutenção
    def test_view_manutencao(self):
        url = reverse('manutencao-detail', args=[self.manutencao.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['descricao'], self.manutencao.descricao)

    # Teste para atualização de um registro de Manutenção
    def test_update_manutencao(self):
        url = reverse('manutencao-detail', args=[self.manutencao.id])
        data = {
            'equipamento': self.equipamento.id,
            'descricao': 'Troca de fonte',
            'data_inicio': '2023-10-05',
            'data_fim': '2023-10-07',
            'tecnico_responsavel': self.servidor.id
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.manutencao.refresh_from_db()
        self.assertEqual(self.manutencao.descricao, 'Troca de fonte')

    # Teste para exclusão de um registro de Manutenção
    def test_delete_manutencao(self):
        url = reverse('manutencao-detail', args=[self.manutencao.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Manutencao.objects.count(), 0)
