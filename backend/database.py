from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
import os
import time

load_dotenv()

Base = declarative_base()
SessionLocal = None
_engine = None  # engine interno armazenado

def init_db(modo: str):
    global SessionLocal, _engine

    # Lê a string de conexão baseada no modo (ex: "online" ou "offline")
    DATABASE_URL = 'sqlite:///./offline.db' if modo == "offline" else os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise ValueError("❌ DATABASE_URL não definido nas variáveis de ambiente")

    # Tenta conectar com retries
    max_retries = 10
    for attempt in range(max_retries):
        try:
            _engine = create_engine(DATABASE_URL)
            with _engine.connect() as conn:
                print("✅ Banco de dados conectado com sucesso!")
            break
        except OperationalError:
            print(f"⏳ Tentativa {attempt+1}/{max_retries}: aguardando banco de dados...")
            time.sleep(3)
    else:
        raise RuntimeError("❌ Não foi possível conectar ao banco de dados após várias tentativas.")

    # Define o sessionmaker global
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)

def get_engine():
    if _engine is None:
        raise RuntimeError("⚠️ O banco de dados ainda não foi inicializado com `init_db`.")
    return _engine

def get_db():
    if SessionLocal is None:
        raise RuntimeError("⚠️ O banco de dados ainda não foi inicializado com `init_db`.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
