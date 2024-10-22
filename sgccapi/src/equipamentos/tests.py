from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from usuarios.models import User, Servidor
from .models import TipoEquipamento, Equipamento, Manutencao, TipoComponente, Componente, EquipComponente


class EquipamentoAPITestCase(APITestCase):

    def setUp(self):
        # Cria um servidor para associar aos equipamentos e manutenções
        self.servidor = Servidor.objects.create(
            inscricao_institucional="12345",
            nome_completo="Servidor Teste"
        )

        # Cria um usuário para autenticação
        self.user = User.objects.create_user(
            email="teste@teste.com",
            password="password123",
            id_servidor=self.servidor
        )
        
        # Realiza login para obter o token JWT
        self.client.login(email='teste@teste.com', password='password123')
        
    def test_tipo_equipamento_crud(self):
        url = reverse('tipoequipamento-list')

        # Criação de TipoEquipamento
        data = {'nome': 'Computador', 'descricao': 'Computador de mesa'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Leitura de TipoEquipamento
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['nome'], 'Computador')

        tipo_equipamento_id = response.data[0]['id']
        url_detail = reverse('tipoequipamento-detail', args=[tipo_equipamento_id])

        # Atualização de TipoEquipamento
        data = {'nome': 'Notebook', 'descricao': 'Computador portátil'}
        response = self.client.put(url_detail, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], 'Notebook')

        # Exclusão de TipoEquipamento
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_equipamento_crud(self):
        tipo = TipoEquipamento.objects.create(nome="Desktop")

        url = reverse('equipamento-list')

        # Criação de Equipamento
        data = {
            'plaqueta': '12345',
            'nome': 'Computador A',
            'marca': 'Dell',
            'estado': 'NOVO',
            'situacao': 'EM_USO',
            'sala': 101,
            'tipo': tipo.id,
            'servidor': self.servidor.id,
            'data_aquisicao': '2024-10-17'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Leitura de Equipamento
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['nome'], 'Computador A')

        equipamento_id = response.data[0]['id']
        url_detail = reverse('equipamento-detail', args=[equipamento_id])

        # Atualização de Equipamento
        data = {
            'plaqueta': '12345',
            'nome': 'Computador B',
            'marca': 'HP',
            'estado': 'NOVO',
            'situacao': 'EM_USO',
            'sala': 101,
            'tipo': tipo.id,
            'servidor': self.servidor.id,
            'data_aquisicao': '2024-10-17'
        }
        response = self.client.put(url_detail, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], 'Computador B')

        # Exclusão de Equipamento
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # Funções de CRUD para Manutencao, TipoComponente, Componente e EquipComponente
    # são similares. Adicione-as da mesma forma que os exemplos acima.
    def test_manutencao_crud(self):
        equipamento = Equipamento.objects.create(
            plaqueta='67890',
            nome='Impressora',
            marca='Epson',
            estado='NOVO',
            situacao='EM_USO',
            sala=102,
            tipo=TipoEquipamento.objects.create(nome='Impressora'),
            servidor=self.servidor,
            data_aquisicao='2024-10-17'
        )

        url = reverse('manutencao-list')

        # Criação de Manutencao
        data = {
            'codigo': 1,
            'data_inicio': '2024-10-17T12:00:00Z',
            'data_fim': '2024-11-17',
            'descricao': 'Manutenção preventiva',
            'equipamento': equipamento.id,
            'responsavel': self.servidor.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Leitura de Manutencao
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['descricao'], 'Manutenção preventiva')

        manutencao_id = response.data[0]['id']
        url_detail = reverse('manutencao-detail', args=[manutencao_id])

        # Atualização de Manutencao
        data = {
            'codigo': 1,
            'data_inicio': '2024-10-17T12:00:00Z',
            'data_fim': '2024-11-17',
            'descricao': 'Manutenção corretiva',
            'equipamento': equipamento.id,
            'responsavel': self.servidor.id
        }
        response = self.client.put(url_detail, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['descricao'], 'Manutenção corretiva')

        # Exclusão de Manutencao
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_tipo_componente_crud(self):
        url = reverse('tipocomponente-list')

        # Criação de TipoComponente
        data = {'nome': 'RAM', 'descricao': 'Memória RAM'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Leitura de TipoComponente
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['nome'], 'RAM')

        tipo_componente_id = response.data[0]['id']
        url_detail = reverse('tipocomponente-detail', args=[tipo_componente_id])

        # Atualização de TipoComponente
        data = {'nome': 'SSD', 'descricao': 'Disco de Estado Sólido'}
        response = self.client.put(url_detail, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], 'SSD')

        # Exclusão de TipoComponente
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_componente_crud(self):
        tipo_componente = TipoComponente.objects.create(nome="RAM", descricao="Memória RAM")

        url = reverse('componente-list')

        # Criação de Componente
        data = {
            'codigo': 12345,
            'nome': 'Corsair Vengeance',
            'descricao': '16GB DDR4',
            'tipo': tipo_componente.id,
            'fabricante': 'Corsair',
            'tamanho_mem': 16,
            'n_serie': 'XYZ12345',
            'data_aquisicao': '2024-10-17'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Leitura de Componente
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['nome'], 'Corsair Vengeance')

        componente_id = response.data[0]['id']
        url_detail = reverse('componente-detail', args=[componente_id])

        # Atualização de Componente
        data = {
            'codigo': 12345,
            'nome': 'Corsair Dominator',
            'descricao': '32GB DDR4',
            'tipo': tipo_componente.id,
            'fabricante': 'Corsair',
            'tamanho_mem': 32,
            'n_serie': 'XYZ67890',
            'data_aquisicao': '2024-10-17'
        }
        response = self.client.put(url_detail, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], 'Corsair Dominator')

        # Exclusão de Componente
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_equip_componente_crud(self):
        equipamento = Equipamento.objects.create(
            plaqueta='12345',
            nome='Computador A',
            marca='Dell',
            estado='NOVO',
            situacao='EM_USO',
            sala=101,
            tipo=TipoEquipamento.objects.create(nome='Desktop'),
            servidor=self.servidor,
            data_aquisicao='2024-10-17'
        )
        componente = Componente.objects.create(
            codigo=12345,
            nome='Corsair Vengeance',
            descricao='16GB DDR4',
            tipo=TipoComponente.objects.create(nome='RAM', descricao='Memória RAM'),
            fabricante='Corsair',
            tamanho_mem=16,
            n_serie='XYZ12345',
            data_aquisicao='2024-10-17'
        )

        url = reverse('equipcomponente-list')

        # Criação de EquipComponente
        data = {
            'equip': [equipamento.id],
            'componente': [componente.id]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Leitura de EquipComponente
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['equip'][0], equipamento.id)

        equip_componente_id = response.data[0]['id']
        url_detail = reverse('equipcomponente-detail', args=[equip_componente_id])

        # Atualização de EquipComponente
        data = {
            'equip': [equipamento.id],
            'componente': [componente.id]
        }
        response = self.client.put(url_detail, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['equip'][0], equipamento.id)

        # Exclusão de EquipComponente
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

