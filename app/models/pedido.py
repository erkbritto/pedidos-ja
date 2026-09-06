"""Modelo ORM da tabela `pedidos` — reflete exatamente o domínio acadêmico.

Nenhuma coluna além de: id, cliente, produto, quantidade, valor_unitario,
valor_total, status, data_criacao.
"""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

# VARCHAR controlado por CHECK constraint (ver migration), não Enum nativo do
# Postgres: mantém a migration simples e evita `ALTER TYPE` ao evoluir.
PEDIDO_STATUS_VALUES = ("CRIADO", "CONFIRMADO", "CANCELADO")


class Pedido(Base):
    """Linha da tabela `pedidos`."""

    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    cliente: Mapped[str] = mapped_column(String(120), nullable=False)
    produto: Mapped[str] = mapped_column(String(120), nullable=False)
    quantidade: Mapped[int] = mapped_column(nullable=False)
    valor_unitario: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    valor_total: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="CRIADO")
    data_criacao: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
