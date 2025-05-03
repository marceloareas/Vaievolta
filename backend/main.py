from fastapi import FastAPI
from database import Base, engine
from models import usuario, pessoa, emprestimo, associacoes
from routers import usuarios 

app = FastAPI()

# Cria as tabelas
Base.metadata.create_all(bind=engine)

app.include_router(usuarios.router)

@app.get("/")
def read_root():
    return {"msg": "API do Vai e Volta"}
