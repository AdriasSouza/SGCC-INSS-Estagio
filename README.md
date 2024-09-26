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

### Backend (Java Spring Boot)
1. Baixe as Extensões:
   - **Extension Pack for Java (Extensão do VS Code)**
     - <https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack>
   - **Spring Boot Extension Pack (Extensão do VS Code)**
     - <https://marketplace.visualstudio.com/items?itemName=pivotal.vscode-boot-dev-pack>
   - **XML (Extensão do VS Code)**
     - <https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml>

2. Navegue até o diretório do backend:
   ```bash
   cd sgccapi
   ```

3. Configure as propriedades do banco de dados no arquivo `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/sgcc
   spring.datasource.username=seu-usuario
   spring.datasource.password=sua-senha
   ```

4. Execute o projeto Spring Boot pela extensão ou com o comando:
   ```bash
   ./mvnw spring-boot:run
   ```
   
5. Baixe e utilize o Postman para testar as requisições
   - **Postman**
   - <https://www.postman.com/downloads/>

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
- **JDK 17**
  - Para verificar se o JDK está corretamente instalado e configurado, digite no prompt de comandos:
    ```console
    javac -version
    ```
  - Se necessário, realizar a instalação e configuração:
    - Link para download: <https://download.oracle.com/java/17/archive/jdk-17.0.10_windows-x64_bin.msi>
    - Criar a variável de ambiente JAVA_HOME configurada para o diretório de instalação do JDK. Exemplo: “C:\Program Files\Java\jdk-17”.
    - Adicionar “%JAVA_HOME%\bin” na variável de ambiente PATH.
    - Tutorial de configuração: <https://mkyong.com/java/how-to-set-java_home-on-windows-10/>

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
- **Maven**
  - Para verificar se o Maven está corretamente instalado e configurado, digite no prompt de comandos:
    ```console
    mvn -version
    ```
  - Se necessário, realizar a instalação e configuração:
    - Link para download: <https://dlcdn.apache.org/maven/maven-3/3.8.8/binaries/apache-maven-3.8.8-bin.zip>
    - Adicionar o diretório de instalação do Maven na variável de ambiente PATH. Exemplo: “C:\apache-maven\bin”.
    - Tutorial de instalação: <https://mkyong.com/maven/how-to-install-maven-in-windows/>
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

- **Criando projetos Spring Boot (VS Code)**
  -Na paleta de comandos do vscode (F1), selecionar a opção “Spring Initializr: Create a MavenProject”.
     ▪ Spring Boot version: 3.2.6
     ▪ Project Language: Java
     ▪ Group ID: inss.sgcc
     ▪ Artifact ID: sgccapi
     ▪ Packing type: Jar
     ▪ Java version: 17
     ▪ Dependencies: Spring Web

## Sites de referência
- Angular Docs: <https://v17.angular.io/docs>
- TypeScript Documentation: <https://www.typescriptlang.org/docs/>
- MDN Web Docs - Aprendendo desenvolvimento web: <https://developer.mozilla.org/pt-BR/docs/Learn>
- Using Angular in Visual Studio Code: <https://code.visualstudio.com/docs/nodejs/angular-tutorial>
- Spring Boot Reference Documentation: <https://docs.spring.io/spring-boot/docs/3.2.6/reference/html/index.html>
- Spring Getting Started Guides: <https://spring.io/guides#getting-started-guides>
- Spring Boot in Visual Studio Code: <https://code.visualstudio.com/docs/java/java-spring-boot>
- Uma visão geral do HTTP: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview>
- Apostila Java e Orientação a Objetos (Caelum/Alura): <https://www.alura.com.br/apostila-java-orientacao-objetos>
- Baeldung: <https://www.baeldung.com/>


