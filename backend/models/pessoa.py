from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, func
from database import Base


class Pessoa(Base):
    __tablename__ = "pessoa"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    email = Column(String)
    telefone = Column(String)
    observacao = Column(String)
    usuario_id = Column(
        Integer, ForeignKey("usuario.id", ondelete="CASCADE"), index=True
    )  # Quem cadastrou essa pessoa
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone,
            "observacao": self.observacao,
            "usuario_id": self.usuario_id,
        }
