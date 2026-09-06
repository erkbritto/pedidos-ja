"""create_pedidos_table

Revision ID: 0001
Revises:
Create Date: 2026-09-02

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: Sequence[str] | str | None = None
depends_on: Sequence[str] | str | None = None


def upgrade() -> None:
    op.create_table(
        "pedidos",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("cliente", sa.String(length=120), nullable=False),
        sa.Column("produto", sa.String(length=120), nullable=False),
        sa.Column("quantidade", sa.Integer(), nullable=False),
        sa.Column("valor_unitario", sa.Numeric(12, 2), nullable=False),
        sa.Column("valor_total", sa.Numeric(12, 2), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="CRIADO"),
        sa.Column(
            "data_criacao",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.CheckConstraint(
            "status IN ('CRIADO', 'CONFIRMADO', 'CANCELADO')",
            name="ck_pedidos_status_valido",
        ),
        sa.CheckConstraint("quantidade >= 1", name="ck_pedidos_quantidade_positiva"),
        sa.CheckConstraint("valor_unitario > 0", name="ck_pedidos_valor_unitario_positivo"),
        sa.CheckConstraint("valor_total > 0", name="ck_pedidos_valor_total_positivo"),
    )


def downgrade() -> None:
    op.drop_table("pedidos")
