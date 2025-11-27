# UniLink
UniLink é uma plataforma projetada para conectar estudantes universitários. Ela permite que estudantes de odontologia solicitem assistência para procedimentos, e que outros estudantes se voluntariem para ajudar, facilitando a colaboração e o aprendizado prático no ambiente acadêmico.

## Tecnologias

-   **Frontend:** React (com Vite), Tailwind CSS
-   **Backend:** Node.js, Express
-   **Banco de Dados:** PostgreSQL
-   **Autenticação:** JSON Web Tokens (JWT)

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:

-   [Node.js](https://nodejs.org/) (versão 18.x ou superior)
-   [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
-   [PostgreSQL](https://www.postgresql.org/)

## Como Iniciar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd Projeto-UniLink
```

### 2. Configurar o Banco de Dados

1.  Inicie o serviço do PostgreSQL.
2.  Crie um novo banco de dados. Por exemplo, `unilink_db`.
3.  Execute os scripts SQL localizados na pasta `server/migrations` para criar as tabelas e popular os dados iniciais. Você pode precisar executar os arquivos em ordem numérica. O arquivo `database.sql` pode conter a estrutura inicial, mas os arquivos de migração são mais recentes.

### 3. Configurar o Backend

1.  Navegue até a pasta do servidor:
    ```bash
    cd server
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie um arquivo de ambiente `.env` na pasta `server` e adicione as seguintes variáveis:
    ```env
    # Configurações do Banco de Dados
    DB_USER=seu_usuario_postgres
    DB_HOST=localhost
    DB_DATABASE=unilink_db
    DB_PASSWORD=sua_senha_postgres
    DB_PORT=5432

    # Segredo para o JWT
    JWT_SECRET=seu_segredo_super_secreto

    # Porta do Servidor
    PORT=8080
    ```

4.  Inicie o servidor backend:
    ```bash
    npm start
    ```
    O servidor estará rodando em `http://localhost:8080`.

### 4. Configurar o Frontend

1.  Volte para a pasta raiz do projeto (se você estiver na pasta `server`):
    ```bash
    cd ..
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie um arquivo de ambiente `.env` na pasta raiz do projeto e adicione a seguinte variável:
    ```env
    VITE_API_URL=http://localhost:8080
    ```

4.  Inicie o servidor de desenvolvimento do frontend:
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## Estrutura do Projeto

```
.
├── /server/      # Código do backend (Node.js, Express)
│   ├── routes/
│   ├── migrations/
│   ├── package.json
│   └── index.js
├── /src/         # Código do frontend (React)
│   ├── components/
│   ├── pages/
│   ├── api/
│   └── main.jsx
├── README.md
└── package.json
```