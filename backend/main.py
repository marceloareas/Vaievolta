from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from database import Base, init_db, get_engine
from routers import usuarios, pessoas, auth, emprestimos, profile, historico, modo
from seed import populate_usuarios, populate_pessoas, populate_emprestimos
from utils import get_modo

@asynccontextmanager
async def lifespan(app: FastAPI):
    modo = get_modo()
    init_db(modo)

    # Cria tabelas só depois do engine estar disponível
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    
    if modo == "online":
        populate_usuarios()
        populate_pessoas()
        populate_emprestimos()

    yield  # <--- continua a execução do FastAPI
    # nada no shutdown

app = FastAPI(lifespan=lifespan)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Rotas
app.include_router(usuarios.router)
app.include_router(pessoas.router)
app.include_router(auth.router)
app.include_router(emprestimos.router)
app.include_router(profile.router)
app.include_router(historico.router)
app.include_router(modo.router)

@app.get("/")
def read_root():
    return {"msg": "API do Vai e Volta"}
