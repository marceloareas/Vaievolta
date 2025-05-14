from datetime import datetime, timedelta
from jose import JWTError, jwt

# Segredo e algoritmos
SECRET_KEY = "chave_conexao_rural"
ALGORITHM = "HS256"
EXPIRA_MINUTOS = 30

def criar_token(data: dict):
    dados = data.copy()
    expiracao = datetime.now().astimezone() + timedelta(minutes=EXPIRA_MINUTOS)
    dados.update({"exp": expiracao})
    token = jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)
    return token