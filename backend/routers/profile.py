import shutil
from auth.auth_utils import verificar_token
from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from uuid import uuid4
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, get_db
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioOut
from passlib.context import CryptContext

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/imagem")
async def upload_imagem(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    try:
        # Salva arquivo fisicamente
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Atualiza foto_url do usuário
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        usuario.foto_perfil = f"/{file_path}"
        print("Salvando foto para usuário:", usuario.email)
        print("Novo caminho:", usuario.foto_perfil)

        db.commit()
        db.refresh(usuario)

        return {"url": f"/{file_path}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar imagem: {e}")
