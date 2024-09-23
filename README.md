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

## Instalação e Configuração

### Backend (Java Spring Boot)
1. Clone este repositório:
   ```bash
   git clone https://github.com/AdriasSouza/sgcc-ufac.git
   ```

2. Navegue até o diretório do backend:
   ```bash
   cd sgcc-ufac/dev
   ```

3. Importe o projeto em sua IDE de preferência (IntelliJ IDEA, Eclipse, etc.).

4. Configure as propriedades do banco de dados no arquivo `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/sgee_db
   spring.datasource.username=seu-usuario
   spring.datasource.password=sua-senha
   ```

5. Execute o projeto Spring Boot pela IDE ou com o comando:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend (Angular)
1. Navegue até o diretório do frontend:
   ```bash
   cd sgee-ufac/frontend
   ```

2. Instale as dependências do Angular:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento do Angular:
   ```bash
   ng serve
   ```

4. Acesse a aplicação no navegador em `http://localhost:4200`.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

## Licença
Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Essa versão reflete as mudanças nas tecnologias usadas, destacando o uso do **Angular** no frontend, **Java Spring Boot** no backend e **MySQL** como banco de dados.
