from pydantic import BaseModel, EmailStr

class PessoaBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    observacao: str

class PessoaCreate(PessoaBase):
    pass

class PessoaOut(PessoaBase):
    id: int
    class Config:
        orm_mode = True
