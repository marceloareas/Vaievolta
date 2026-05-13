# Vaievolta

# Projeto VaiEVolta

O projeto **VaiEVolta** tem como principal objetivo gerenciar objetos emprestados para outras pessoas.

## Funcionalidades

1. O usuário, depois de **criar sua conta** ou **fazer login**, deve cadastrar as seguintes informações:
    - Nome
    - Email
    - Endereço
    - Telefone
    - Senha

2. Em seguida, deve informar o objeto que foi ou será emprestado, incluindo:
    - Nome do item
    - Descrição do item
    - Foto do item
    - Data do empréstimo
    - Data esperada de devolução
    - Pessoa para quem o item foi emprestado

3. Durante o uso do aplicativo, o usuário pode:
    - Acessar todos os objetos já cadastrados.
    - Verificar o status dos objetos.
    - Ver a **data de devolução real** e compará-la com a **data de devolução esperada**.
  
## Prototipagem parcial

![image](https://github.com/user-attachments/assets/6dbaf732-42c7-4a9f-9780-a45d6e25f4f3)

Link para o Figma: https://www.figma.com/design/CFKBBcsuK4RQOKu8qh9ajc/vai-volta?t=2ZUvDD8zBVTZvGUs-1

## Modelo Lógico de Entidade e Relacionamento

![Untitled](https://github.com/user-attachments/assets/3f787047-4808-4dc7-b25c-c74943b7432a)

# Documentação do projeto

## 🐳 Estrutura Docker do Projeto `vaievolta`

<img width="1131" height="196" alt="image" src="https://github.com/user-attachments/assets/557ff9dc-0e55-4a1d-a2f4-359eca9fcd89" />

### 📦 Visão Geral

Este projeto utiliza **Docker Compose** para orquestrar uma aplicação full-stack composta por:

- **Backend**: FastAPI com SQLAlchemy
- **Frontend**: React + Vite, servido via Nginx
- **Banco de dados**: PostgreSQL 17

---

### 🗂️ Containers e Serviços

| Serviço     | Imagem Base           | Porta (host) | Descrição                                                                 |
|-------------|-----------------------|--------------|---------------------------------------------------------------------------|
| `database`  | `postgres:17-alpine`  | — (interno)  | Banco de dados utilizado pelo backend.                                    |
| `backend`   | `vaievolta-backend`   | — (interno)  | API construída com FastAPI, acessada via proxy do frontend.               |
| `frontend`  | `vaievolta-frontend`  | 80           | Interface React (Vite) servida por Nginx, com proxy reverso para o backend. |

---

### 🔗 Acesso aos Serviços

- **Aplicação (frontend + API via proxy)**: http://localhost
- O backend e o banco não são expostos diretamente ao host. O frontend (Nginx) faz o proxy das chamadas para `/api` até o backend.
### 🚀 Como subir o projeto

1. Copie `.env.example` para `.env` na raiz do projeto e preencha as variáveis:

    ```bash
    cp .env.example .env
    ```
    
    A `SECRET_KEY` pode ser gerada com:
    
    ```bash
    python -c "import secrets; print(secrets.token_hex(32))"
    ```

2. No terminal, na raiz do projeto, execute:

    ```bash
    docker compose up --build
    ```

### Comando para subir uma nova versão do banco de dados (migration)

```bash
docker exec backend alembic revision --autogenerate -m "initial migration"
```

### Comando para aplicar a última versão do banco de dados (migration)

```bash
docker exec backend alembic upgrade head
```

