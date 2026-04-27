#!/bin/bash
set -e

# Aplica as migrations do Alembic
alembic upgrade head

# Sobe o servidor FastAPI
exec uvicorn main:app --host 0.0.0.0 --port 8000
