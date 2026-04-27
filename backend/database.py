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
_engine = None


def init_db():
    global SessionLocal, _engine

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise ValueError("❌ DATABASE_URL não definido nas variáveis de ambiente")

    max_retries = 10
    for attempt in range(max_retries):
        try:
            _engine = create_engine(
                DATABASE_URL,
                pool_size=5,
                max_overflow=10,
                pool_pre_ping=True,
                pool_recycle=300,
            )
            with _engine.connect():
                print("✅ Banco de dados conectado com sucesso!")
            break
        except OperationalError:
            print(
                f"⏳ Tentativa {attempt + 1}/{max_retries}: aguardando banco de dados..."
            )
            time.sleep(3)
    else:
        raise RuntimeError(
            "❌ Não foi possível conectar ao banco de dados após várias tentativas."
        )

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)


def get_engine():
    if _engine is None:
        raise RuntimeError(
            "⚠️ O banco de dados ainda não foi inicializado com `init_db`."
        )
    return _engine


def get_db():
    if SessionLocal is None:
        raise RuntimeError(
            "⚠️ O banco de dados ainda não foi inicializado com `init_db`."
        )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
