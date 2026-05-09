"""initial schema

Revision ID: 001_initial_schema
Revises:
Create Date: 2026-04-27

"""

from typing import Sequence, Union
import sqlalchemy as sa
from alembic import op

revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "usuario",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(), nullable=True),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column("senha", sa.String(), nullable=True),
        sa.Column("endereco", sa.String(), nullable=True),
        sa.Column("telefone", sa.String(), nullable=True),
        sa.Column("foto_perfil", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_usuario_id"), "usuario", ["id"], unique=False)
    op.create_index(op.f("ix_usuario_email"), "usuario", ["email"], unique=True)

    op.create_table(
        "pessoa",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(), nullable=True),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column("telefone", sa.String(), nullable=True),
        sa.Column("observacao", sa.String(), nullable=True),
        sa.Column("usuario_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["usuario_id"], ["usuario.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_pessoa_id"), "pessoa", ["id"], unique=False)

    op.create_table(
        "emprestimo",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(), nullable=False),
        sa.Column("item", sa.String(), nullable=True),
        sa.Column("descricao", sa.String(), nullable=True),
        sa.Column("data_emprestimo", sa.Date(), nullable=True),
        sa.Column("data_devolucao_esperada", sa.Date(), nullable=True),
        sa.Column("data_devolucao_real", sa.Date(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("foto_url", sa.String(), nullable=True),
        sa.Column("pessoa_id", sa.Integer(), nullable=True),
        sa.Column("usuario_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["pessoa_id"], ["pessoa.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["usuario_id"], ["usuario.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_emprestimo_id"), "emprestimo", ["id"], unique=False)


def downgrade() -> None:
    op.drop_table("emprestimo")
    op.drop_index(op.f("ix_pessoa_id"), table_name="pessoa")
    op.drop_table("pessoa")
    op.drop_index(op.f("ix_usuario_email"), table_name="usuario")
    op.drop_index(op.f("ix_usuario_id"), table_name="usuario")
    op.drop_table("usuario")
