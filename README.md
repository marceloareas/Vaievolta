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

## Modelo Lógico de Entidade e Relacionamento

![image](https://github.com/user-attachments/assets/f89fb779-8d9f-490a-91d3-7bff843345a2)

## Modelo Conceitual de Entidade e Relacionamento

![image](https://github.com/user-attachments/assets/7cd8452e-2b8a-4470-8ab7-ad2b946ae9e4)


# Documentação do projeto

## 🐳 Estrutura Docker do Projeto `vaievolta`

![image](https://github.com/user-attachments/assets/94499324-eeff-486b-aa5f-91c2ba39acc6)

### 📦 Visão Geral

Este projeto utiliza **Docker Compose** para orquestrar uma aplicação full-stack composta por:

- **Backend**: FastAPI com SQLAlchemy
- **Frontend**: React usando Vite
- **Banco de dados**: PostgreSQL
- **Adminer**: Interface web para acesso ao banco

---

### 🗂️ Containers e Serviços

| Serviço    | Imagem Base        | Porta | Descrição                                                                 |
|------------|--------------------|-------|--------------------------------------------------------------------------|
| `db`       | `postgres:13`      | 5432  | Banco de dados utilizado pelo backend.                                   |
| `backend`  | `vaievolta-backend`| 8000  | API construída com FastAPI.                                              |
| `frontend` | `vaievolta-frontend`| 3000 | Interface React.                                                         |
| `adminer`  | `adminer`          | 8080  | Ferramenta web para gerenciamento do banco PostgreSQL.                   |

---

### 🔗 Acesso aos Serviços

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **Adminer**: http://localhost:8080

### 🎛️ Credenciais do Adminer

- **Sistema**: PostgreSQL
- **Servidor**: db
- **Usuário**: postgres
- **Senha**: postgres
- **Banco de dados**: mydatabase

### 🚀 Como subir o projeto

No terminal, na raiz do projeto, execute:

```bash
docker compose up --build
```
