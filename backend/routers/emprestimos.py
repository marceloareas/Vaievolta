from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from auth.auth_utils import verificar_token
from database import get_db
from schemas.emprestimo import EmprestimoCreate, EmprestimoOut, EmprestimoDelete, EmprestimoUpdate
from models.emprestimo import Emprestimo
import datetime

router = APIRouter(prefix="/emprestimos", tags=["emprestimos"])

@router.post("/", response_model=EmprestimoOut)
def criar_emprestimo(
    emprestimo: EmprestimoCreate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    try:
        novo = Emprestimo(
            **emprestimo.model_dump(),
            usuario_id=usuario_id
        )
        db.add(novo)
        db.commit()
        db.refresh(novo)
        return novo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao criar empréstimo: {str(e)}")

@router.delete("/{emprestimo_id}", response_model=EmprestimoOut)
def deletar_emprestimo(emprestimo: EmprestimoDelete, db: Session = Depends(get_db)):
    emprestimo = db.query(Emprestimo).filter(Emprestimo.id == emprestimo.id).first()
    try:
        db.delete(emprestimo)
        db.commit()
        return emprestimo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao deletar empréstimo: {str(e)}")

@router.put("/devolver/{emprestimo_id}", response_model=EmprestimoOut)
def registrar_devolucao(emprestimo: EmprestimoUpdate, db: Session = Depends(get_db)):
    emprestimo = db.query(Emprestimo).filter(Emprestimo.id == emprestimo.id).first()
    try:
        emprestimo.data_devolucao_real = datetime.date.today()
        emprestimo.status = 'Devolvido'
        db.commit()
        db.refresh(emprestimo)
        return emprestimo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao registrar devolução: {str(e)}")

@router.get("/", response_model=list[EmprestimoOut])
def listar_emprestimos(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    return (
        db.query(Emprestimo)
        .filter(Emprestimo.usuario_id == usuario_id)
        .filter(Emprestimo.status != "Devolvido")
        .order_by(Emprestimo.data_devolucao_esperada.asc())
        .all()
    )