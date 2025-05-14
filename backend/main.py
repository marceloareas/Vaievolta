from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from models import usuario, pessoa, emprestimo, associacoes
from routers import usuarios, pessoas, auth, emprestimos
from seed import populate_emprestimos, populate_pessoas

app = FastAPI()

# Middleware CORS 👇
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Porta do Vite/React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cria as tabelas
Base.metadata.create_all(bind=engine)

populate_pessoas()
populate_emprestimos()

app.include_router(usuarios.router)
app.include_router(pessoas.router)
app.include_router(auth.router)
app.include_router(emprestimos.router)

@app.get("/")
def read_root():
    return {"msg": "API do Vai e Volta"}
