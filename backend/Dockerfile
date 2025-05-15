# Usar a imagem oficial do Python como base
FROM python:3.9

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar o arquivo de dependências para dentro do container
COPY requirements.txt .

# Instalar as dependências do projeto
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o restante do código do backend
COPY . .

# Expor a porta que a aplicação vai rodar
EXPOSE 8000

# Comando para rodar a aplicação usando o Uvicorn (para FastAPI)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
