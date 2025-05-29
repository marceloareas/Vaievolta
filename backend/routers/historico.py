from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from auth.auth_utils import verificar_token
from database import get_db
from schemas.emprestimo import EmprestimoCreate, EmprestimoOut, EmprestimoDelete, EmprestimoUpdate
from models.emprestimo import Emprestimo
import datetime

router = APIRouter(prefix="/historico", tags=["historico"])

@router.get("/", response_model=list[EmprestimoOut])
def relatorio_emprestimos(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    return (
        db.query(Emprestimo)
        .filter(Emprestimo.usuario_id == usuario_id)  # se quiser todos sem filtro de usuário, remova esta linha
        .order_by(Emprestimo.data_emprestimo.desc())
        .all()
    )
