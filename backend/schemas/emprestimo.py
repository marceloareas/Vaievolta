from pydantic import BaseModel
from datetime import date

class EmprestimoBase(BaseModel):
    item: str
    descricao: str
    data_emprestimo: date
    data_devolucao_esperada: date
    data_devolucao_real: date | None = None
    status: str
    foto_url: str
    tomador: str

class EmprestimoCreate(EmprestimoBase):
    pass

class EmprestimoOut(EmprestimoBase):
    id: int
    class Config:
        orm_mode = True
