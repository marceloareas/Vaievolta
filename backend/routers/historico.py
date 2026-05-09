from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from auth.auth_utils import verificar_token
from database import get_db
from schemas.emprestimo import EmprestimoOut
from models.emprestimo import Emprestimo
from models.pessoa import Pessoa  # noqa: F401 – used via Emprestimo.pessoa relationship

router = APIRouter(prefix="/historico", tags=["historico"])


@router.get("/", response_model=list[EmprestimoOut])
def relatorio_emprestimos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=200, ge=1, le=500),
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    emprestimos = (
        db.query(Emprestimo)
        .options(joinedload(Emprestimo.pessoa))
        .filter(Emprestimo.usuario_id == usuario_id)
        .order_by(Emprestimo.data_emprestimo.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    for emp in emprestimos:
        emp.nome_pessoa = emp.pessoa.nome if emp.pessoa else None
    return emprestimos
