from http.client import HTTPException
import json
from auth.auth_utils import verificar_token
from fastapi import APIRouter, Depends, File, Response, UploadFile
from sqlalchemy.orm import Session
from database import SessionLocal
from models.emprestimo import Emprestimo
from models.pessoa import Pessoa
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioUpdate
from passlib.context import CryptContext

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=UsuarioOut)
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(usuario.senha)
    novo = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=hashed_password
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.patch("/me")
def atualizar_usuario(
    dados: UsuarioUpdate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if dados.nome is not None:
        usuario.nome = dados.nome
    if dados.endereco is not None:
        usuario.endereco = dados.endereco
    if dados.telefone is not None:
        usuario.telefone = dados.telefone

    db.commit()
    db.refresh(usuario)

    return {"msg": "Usuário atualizado com sucesso", "usuario": usuario}

@router.delete("/me")
def excluir_usuario(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db.delete(usuario)
    db.commit()

    return {"msg": "Usuário excluído com sucesso"}

# @router.get("/exportar-dados")
# def exportar_dados(db: Session = Depends(get_db)):
#     emprestimos = db.query(Emprestimo).all()
#     pessoas = db.query(Pessoa).all()

#     def to_dict(obj):
#         return {col.name: getattr(obj, col.name) for col in obj.__table__.columns}

#     dados = {
#         "pessoas": [to_dict(p) for p in pessoas],
#         "emprestimos": [to_dict(e) for e in emprestimos],
#     }

#     json_data = json.dumps(dados, ensure_ascii=False, indent=2)
#     return Response(content=json_data, media_type="application/json")

# @router.post("/importar-dados")
# async def importar_dados(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     contents = await file.read()
#     dados = json.loads(contents)

#     # Importar pessoas
#     for pessoa in dados.get("pessoas", []):
#         db.merge(Pessoa(**pessoa))  # merge = atualiza ou insere

#     # Importar empréstimos
#     for emp in dados.get("emprestimos", []):
#         db.merge(Emprestimo(**emp))

#     db.commit()
#     return {"mensagem": "Dados importados com sucesso"}
