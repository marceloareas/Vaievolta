from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator


class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr
    endereco: str
    telefone: str


class UsuarioLogin(BaseModel):
    email: str
    senha: str

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, v: str) -> str:
        return v.lower()


class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, v: str) -> str:
        return v.lower()


class UsuarioOut(BaseModel):
    id: int
    nome: str
    email: EmailStr

    class Config:
        from_attributes = True


class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    endereco: Optional[str] = None
    telefone: Optional[str] = None
