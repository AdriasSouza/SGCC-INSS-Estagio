# SGCC-UFAC: Sistema de Gerenciamento e Catalogação de Computadores para o INSS

## Descrição
Este repositório contém o código-fonte do **Sistema de Gerenciamento e Catalogação de Computadores** (SGCC-UFAC), desenvolvido para a Gerência Executiva do Instituto Nacional do Seguro Social (INSS) no Acre. O sistema foi criado como parte de um estágio supervisionado do curso de Bacharelado em Sistemas de Informação da Universidade Federal do Acre (UFAC).

O principal objetivo do projeto é automatizar a catalogação e monitoramento de computadores e componentes de hardware nas Agências da Previdência Social, permitindo a identificação de equipamentos obsoletos ou que necessitam de manutenção. A solução também gera relatórios detalhados que facilitam a tomada de decisões estratégicas relacionadas à gestão do parque tecnológico do INSS.

## Funcionalidades
- Cadastro de computadores e componentes de hardware (CPU, memória RAM, armazenamento, etc.).
- Monitoramento do estado dos equipamentos (funcional, obsoleto, necessitando manutenção).
- Geração de relatórios detalhados sobre os equipamentos cadastrados.
- Controle de manutenção e substituição de equipamentos obsoletos.
- Sistema de login com diferentes níveis de acesso (administrador, técnico, usuário comum).
- Interface amigável e responsiva para consulta e edição de dados.

## Tecnologias Utilizadas
- **Frontend**: Angular, HTML5, CSS3, Bootstrap
- **Backend**: Java (Spring Boot)
- **Banco de Dados**: MySQL
- **Controle de Versão**: Git/GitHub

## Atualizando seu repositório local
O código produzido e compartilhado neste repositório, pode ser atualizado em seu repositório local com o comando:

```console
git pull
```

Caso ocorram alterações no seu repositório local, o comando acima pode gerar conflitos. Para evitar lidar com isso, você pode forçar uma atualização com o repositório remoto por meio dos comandos:

```console
git fetch origin
git reset --hard origin/main
```

O primeiro comando recebe as atualizações mais recentes do repositório remoto, e o segundo descarta todas as alterações locais e atualiza com o histórico mais recente do repositório remoto (branch main).

## Instalação e Configuração

### Backend (Django API Rest)

1. Navegue até o diretório do backend:
   ```bash
   cd sgccapi
   ```

2. Crie um ambiente virtual:
   ```bash
   python -m venv .venv 
   ```

3. Ative a venv:
   ```bash
   .\venv\Scripts\activate
   ```
   
5. Instale as dependencias
   ```bash
   pip install -r requirements.txt
   ```

6. Faça as migrações do banco de dados
  ```bash
  python manage.py makemigrations
  ```

7. Rode o server
  ```bash
  python manage.py runserver 
  ```

8. Baixe e utilize o Postman para testar as requisições
  - Postman
  - https://www.postman.com/downloads/


### Frontend (Angular)
1. Baixe as extensões:
   - **Angular Language Service (Extensão do VS Code)**
   - <https://marketplace.visualstudio.com/items?itemName=Angular.ng-template>

2. Navegue até o diretório do frontend:
   ```bash
   cd sgccapp
   ```

3. Instale as dependências do Angular:
   ```bash
   npm install
   ```

4. Execute o servidor de desenvolvimento do Angular:
   ```bash
   ng serve
   ```
   ou com o protocolo HTTPS
   ```bash
   ng serve --ssl
   ```

5. Acesse a aplicação no navegador em `http://localhost:4200`.
   
6. Em caso de erro com o ng serve, no navegador digite:
    ```console
    chrome: chrome://net-internals/#hsts
    edge: edge://net-internals/#hsts
    brave: brave://net-internals/#hsts
    ```
    No campo em Delete domain security policies, adicione localhost e clique no botão delete

## Ferramentas
- **Visual Studio Code**
  - <https://code.visualstudio.com/Download>
- **Git**
  - <https://git-scm.com/downloads>

Front-End
- **Node.js (e npm)**
  - Versão 20 (LTS).
  - Para verificar a versão do Node.js, no prompt de comandos digite:
    ```console
    node --version
    ```
  - Link para download: <https://nodejs.org/dist/v20.14.0/node-v20.14.0-x64.msi>
- **Angular CLI**
  - Versão 17.
  - Para verificar a versão do Angular CLI, no prompt de comandos digite:
    ```console
    ng version
    ```
  - Tutorial de instalação: <https://v17.angular.io/guide/setup-local>

Back-End
- **Python**
  - Para verificar se o Python está corretamente instalado e configurado, digite no prompt de comandos:
    ```console
    py
    ```
  - Se necessário, realizar a instalação e configuração:
    - Link para download: <https://www.python.org/downloads/>
    - Tutorial de instalação: <https://wiki.python.org/moin/BeginnersGuide/Download>
- **MySQL**
  - Verificar se o MySQL está funcionando:
    - Para tentar conectar no MySQL, no prompt de comandos digite:
      ```console
      mysql -u root -p
      ```
    - Tentar acessar com senha em branco ou senha igual ao nome de usuário (root).
    - Tutorial para resetar a senha de root, caso necessário: <https://dev.mysql.com/doc/mysql-windows-excerpt/8.0/en/resetting-permissions-windows.html>
  - Remova o banco de dados ```sgcc```, se existir:
    - No prompt de comandos digite:
      ```console
      mysql -u root -p
      ```
    - Ao conectar no MySQL, execute a seguinte instrução SQL:
      ```sql
      DROP DATABASE sgcc;
      ``` 
  - Se necessário, realizar a instalação:
    - Link para download: <https://dev.mysql.com/downloads/file/?id=516927>
    - [Tutorial de instalação](https://github.com/webacademyufac/tutoriais/blob/main/mysql/mysql.md)


