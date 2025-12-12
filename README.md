# Portal de Estágios - Frontend

Este é o repositório do **frontend** do Portal de Estágios, uma Single Page Application (SPA) desenvolvida em **Next.js**. A aplicação consome a API RESTful do [backend em JAVA Spring Boot](https://github.com/ArthurEdu05/Portal-Estagios-Ps2) para fornecer uma plataforma completa e interativa para estudantes, empresas e administradores.

## Visão Geral do Projeto

O Portal de Estágios foi projetado para ser a ponte entre estudantes que buscam por oportunidades de carreira e empresas que desejam atrair novos talentos. A solução completa é dividida em dois repositórios:

- **Frontend (este repositório):** Interface do usuário, responsável pela apresentação dos dados e interação com o usuário.
- **Backend:** [Repositório da API em JAVA Spring Boot](https://github.com/ArthurEdu05/Portal-Estagios-Ps2), responsável pela lógica de negócio, gerenciamento de dados e segurança.

## Funcionalidades do Frontend

A interface do usuário foi construída para ser intuitiva e adaptada para cada perfil de usuário, implementando as seguintes funcionalidades:

### Para Todos os Usuários
- **Login Unificado:** Uma única tela de login que autentica e redireciona estudantes, empresas e administradores para seus respectivos painéis.
- **Cadastro:** Telas específicas para o cadastro de novos estudantes, empresas e administradores.

### Painel do Estudante
- **Home/Dashboard:** Visualização de vagas recomendadas com base nas áreas de interesse do estudante.
- **Listagem de Vagas:** Tela para pesquisar, filtrar e visualizar todas as vagas abertas.
- **Detalhes da Vaga:** Modal com informações completas sobre uma vaga.
- **Inscrição:** Funcionalidade para se candidatar a uma vaga diretamente pela tela de detalhes.
- **Minhas Candidaturas:** Uma área onde o estudante pode acompanhar o status de todas as suas inscrições.

### Painel da Empresa
- **Home/Dashboard:** Visualização dos estudantes que se candidataram às vagas da empresa.
- **Gerenciamento de Vagas:** Painel para criar, editar, excluir e encerrar as vagas de estágio publicadas pela empresa.
- **Formulário de Vaga:** Interface para o cadastro e edição detalhada de uma vaga.

### Painel do Administrador
- **Dashboard de Estatísticas:** Visualização de dados do portal, como a quantidade de estudantes, empresas e vagas, além de um gráfico de vagas por área.
- **Gerenciamento de Usuários:** Listagem de todos os estudantes e empresas cadastradas.
- **Gerenciamento de Vagas:** Visualização sobre todas as vagas publicadas na plataforma.
- **Gerenciamento de Áreas de Interesse:** CRUD completo para as áreas de interesse que categorizam as vagas.

## Tecnologias Utilizadas

- **Next.js:** Framework React para uma experiência de usuário rápida e otimizada.
- **React:** Biblioteca para a construção de componentes de UI reutilizáveis e reativos.
- **Tailwind CSS:** Framework de design para a criação de interfaces modernas e responsivas.
- **Recharts:** Biblioteca para a criação de gráficos interativos, utilizada no dashboard do administrador.

## Executando o Projeto Localmente

Para executar o ecossistema completo, tanto o frontend quanto o backend precisam estar em execução simultaneamente. (Preferência de rodar o Backend primeiro)

### 1. Backend (API REST em Spring)

Siga as instruções no [repositório do backend](https://github.com/ArthurEdu05/Portal-Estagios-Ps2) para clonar, configurar e executar o projeto. Por padrão, ela estará disponível em `http://localhost:8080`.

### 2. Frontend (Esta Aplicação)

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd frontend_next
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute a aplicação:**
    ```bash
    npm run dev
    ```

    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para interagir com o portal.

