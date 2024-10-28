from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from .models import Agencia, Setor, Servidor, Solicitacao, User


class UserTests(APITestCase):

    def setUp(self):
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'testpassword',
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_register_user(self):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'password': 'newpassword'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        url = reverse('login')
        data = {
            'email': self.user.email,
            'password': 'testpassword'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('jwt', response.data)

        # Armazenar o token JWT
        self.client.cookies['jwt'] = response.data['jwt']  # Configura o cookie no cliente

    def test_get_user_info(self):
        # Primeiro faça o login
        self.test_login_user()  # Chamando o método que faz login e configura o cookie

        url = reverse('user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_get_superuser_info(self):
        # Criação de um superusuário
        superuser_data = {
            'email': 'superuser@example.com',
            'password': 'superpassword',
        }
        superuser = User.objects.create_superuser(**superuser_data)

        # Faça o login como superusuário
        self.client.post(reverse('login'), {
            'email': superuser.email,
            'password': 'superpassword'
        })

        url = reverse('user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], superuser.email)


class AgenciaTests(APITestCase):

    def setUp(self):
        self.agencia_data = {'nome': 'Agência Teste', 'numero': 1}
        self.agencia = Agencia.objects.create(**self.agencia_data)

    def test_create_agencia(self):
        url = reverse('agencia-list')
        data = {'nome': 'Nova Agência', 'numero': 2}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_agencias(self):
        url = reverse('agencia-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_update_agencia(self):
        url = reverse('agencia-detail', kwargs={'pk': self.agencia.id})
        data = {'nome': 'Agência Atualizada', 'numero': 3}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.agencia.refresh_from_db()
        self.assertEqual(self.agencia.nome, 'Agência Atualizada')

    def test_delete_agencia(self):
        url = reverse('agencia-detail', kwargs={'pk': self.agencia.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Agencia.objects.filter(id=self.agencia.id).exists())


class SetorTests(APITestCase):

    def setUp(self):
        self.agencia = Agencia.objects.create(nome='Agência Teste', numero=1)
        self.setor_data = {'codigo': 101, 'nome': 'Setor Teste', 'id_agencia': self.agencia}
        self.setor = Setor.objects.create(**self.setor_data)

    def test_create_setor(self):
        url = reverse('setor-list')
        data = {'codigo': 102, 'nome': 'Novo Setor', 'id_agencia': self.agencia.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_setores(self):
        url = reverse('setor-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_update_setor(self):
        url = reverse('setor-detail', kwargs={'pk': self.setor.id})
        data = {'codigo': 201, 'nome': 'Setor Atualizado', 'id_agencia': self.agencia.id}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.setor.refresh_from_db()
        self.assertEqual(self.setor.nome, 'Setor Atualizado')

    def test_delete_setor(self):
        url = reverse('setor-detail', kwargs={'pk': self.setor.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Setor.objects.filter(id=self.setor.id).exists())


class ServidorTests(APITestCase):

    def setUp(self):
        self.agencia = Agencia.objects.create(nome='Agência Teste', numero=1)
        self.setor = Setor.objects.create(codigo=101, nome='Setor Teste', id_agencia=self.agencia)
        self.servidor_data = {'inscricao_institucional': '123456', 'nome_completo': 'Servidor Teste', 'setor': self.setor}
        self.servidor = Servidor.objects.create(**self.servidor_data)

    def test_create_servidor(self):
        url = reverse('servidor-list')
        data = {'inscricao_institucional': '789012', 'nome_completo': 'Novo Servidor', 'setor': self.setor.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_servidores(self):
        url = reverse('servidor-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_update_servidor(self):
        url = reverse('servidor-detail', kwargs={'pk': self.servidor.id})
        data = {'inscricao_institucional': '1234567', 'nome_completo': 'Servidor Atualizado', 'setor': self.setor.id}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.servidor.refresh_from_db()
        self.assertEqual(self.servidor.nome_completo, 'Servidor Atualizado')

    def test_delete_servidor(self):
        url = reverse('servidor-detail', kwargs={'pk': self.servidor.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Servidor.objects.filter(id=self.servidor.id).exists())


class SolicitacaoTests(APITestCase):

    def setUp(self):
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'testpassword',
        }
        self.user = User.objects.create_user(**self.user_data)
        self.agencia = Agencia.objects.create(nome='Agência Teste', numero=1)
        self.setor = Setor.objects.create(codigo=101, nome='Setor Teste', id_agencia=self.agencia)
        self.servidor = Servidor.objects.create(inscricao_institucional='123456', nome_completo='Servidor Teste', setor=self.setor)
        self.solicitacao_data = {'user': self.user, 'descricao': 'Solicitação Teste', 'estado': 'Pendente'}
        self.solicitacao = Solicitacao.objects.create(**self.solicitacao_data)

    def test_create_solicitacao(self):
        url = reverse('solicitacao-list')
        data = {'user': self.user.id, 'descricao': 'Nova Solicitação', 'estado': 'Pendente'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_solicitacoes(self):
        url = reverse('solicitacao-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_update_solicitacao(self):
        url = reverse('solicitacao-detail', kwargs={'pk': self.solicitacao.id})
        data = {'user': self.user.id, 'descricao': 'Solicitação Atualizada', 'estado': 'Concluída'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.solicitacao.refresh_from_db()
        self.assertEqual(self.solicitacao.descricao, 'Solicitação Atualizada')

    def test_delete_solicitacao(self):
        url = reverse('solicitacao-detail', kwargs={'pk': self.solicitacao.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Solicitacao.objects.filter(id=self.solicitacao.id).exists())