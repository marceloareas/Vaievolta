#!/bin/bash
set -e

# Espera o banco de dados subir
until nc -z db 5432; do
  echo "Aguardando o banco de dados..."
  sleep 2
done

# Aplica as migrations do Alembic
alembic upgrade head

# Sobe o servidor FastAPI (com reload para dev, sem --reload para produção)
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
