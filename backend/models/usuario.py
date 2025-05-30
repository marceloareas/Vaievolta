from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    email = Column(String, unique=True, index=True)
    senha = Column(String)
    endereco = Column(String)
    telefone = Column(String)
    foto_perfil = Column(String)

    emprestimos = relationship(
        "Emprestimo",
        back_populates="usuario",
        cascade="all, delete-orphan"
    )