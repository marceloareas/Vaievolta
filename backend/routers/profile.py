import os
import uuid
import aiofiles
from auth.auth_utils import verificar_token
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario

UPLOAD_DIR = os.path.join("uploads", "pessoa_pictures")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/imagem")
async def upload_imagem(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Tipo de arquivo não permitido")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Arquivo excede o limite de 5 MB")

    raw_ext = os.path.splitext(os.path.basename(file.filename or ""))[1].lower()
    ext = raw_ext if raw_ext in ALLOWED_EXTENSIONS else ".jpg"
    safe_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    async with aiofiles.open(file_path, "wb") as buffer:
        await buffer.write(contents)

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        os.remove(file_path)
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    url = "/uploads/pessoa_pictures/" + safe_name
    usuario.foto_perfil = url
    db.commit()
    db.refresh(usuario)

    return {"url": url}
