"""Repository de Pedidos — única camada que conhece SQLAlchemy diretamente.

Operações suficientes para o escopo da Entrega 1: sem abstrações genéricas
de repositório, sem Unit of Work.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.pedido import Pedido


class PedidoRepository:
    """Acesso a dados da tabela `pedidos`."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def create(self, pedido: Pedido) -> Pedido:
        self._db.add(pedido)
        self._db.commit()
        self._db.refresh(pedido)
        return pedido

    def get_by_id(self, pedido_id: int) -> Pedido | None:
        return self._db.get(Pedido, pedido_id)

    def list_all(self) -> list[Pedido]:
        statement = select(Pedido).order_by(Pedido.id)
        return list(self._db.scalars(statement).all())

    def update_status(self, pedido: Pedido, status: str) -> Pedido:
        pedido.status = status
        self._db.commit()
        self._db.refresh(pedido)
        return pedido
