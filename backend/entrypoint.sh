#!/bin/bash
set -e

# Aplica as migrations do Alembic
alembic upgrade head

# Sobe o servidor FastAPI (com reload para dev, sem --reload para produção)
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
