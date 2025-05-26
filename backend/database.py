from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
import os
import time

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Retry para aguardar o banco estar pronto
max_retries = 10
retry_count = 0
engine = None

while retry_count < max_retries:
    try:
        engine = create_engine(DATABASE_URL)
        # testa conexão
        with engine.connect() as conn:
            print("✅ Banco de dados conectado com sucesso!")
        break
    except OperationalError:
        retry_count += 1
        print(f"⏳ Tentativa {retry_count}/{max_retries}: aguardando banco ficar pronto...")
        time.sleep(3)
else:
    raise RuntimeError("❌ Não foi possível conectar ao banco de dados após várias tentativas.")

# Criar a base para os modelos
Base = declarative_base()

# Criar a sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
