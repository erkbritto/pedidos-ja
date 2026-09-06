"""`PedidoService` — concentra as regras da aplicação de Pedidos.

O cliente da API nunca controla `id`, `valor_total`, o status inicial ou
`data_criacao`: tudo isso é decidido aqui, nunca na camada HTTP.
"""

from decimal import ROUND_HALF_UP, Decimal

from app.models.pedido import Pedido
from app.repositories.pedido_repository import PedidoRepository
from app.schemas.pedido import PedidoCreate, PedidoStatus

_CENTAVOS = Decimal("0.01")


def calcular_valor_total(quantidade: int, valor_unitario: Decimal) -> Decimal:
    """`valor_total = quantidade × valor_unitario`, normalizado para 2 casas decimais."""
    total = Decimal(quantidade) * valor_unitario
    return total.quantize(_CENTAVOS, rounding=ROUND_HALF_UP)


class PedidoNaoEncontradoError(Exception):
    """Levantada quando um Pedido solicitado não existe."""


class PedidoService:
    """Regras de aplicação do domínio Pedido."""

    def __init__(self, repository: PedidoRepository) -> None:
        self._repository = repository

    def criar_pedido(self, dados: PedidoCreate) -> Pedido:
        cliente = dados.cliente.strip()
        produto = dados.produto.strip()
        valor_total = calcular_valor_total(dados.quantidade, dados.valor_unitario)

        pedido = Pedido(
            cliente=cliente,
            produto=produto,
            quantidade=dados.quantidade,
            valor_unitario=dados.valor_unitario,
            valor_total=valor_total,
            status=PedidoStatus.CRIADO.value,
        )
        return self._repository.create(pedido)

    def buscar_pedido(self, pedido_id: int) -> Pedido:
        pedido = self._repository.get_by_id(pedido_id)
        if pedido is None:
            raise PedidoNaoEncontradoError(pedido_id)
        return pedido

    def listar_pedidos(self) -> list[Pedido]:
        return self._repository.list_all()

    def atualizar_status(self, pedido_id: int, status: PedidoStatus) -> Pedido:
        pedido = self.buscar_pedido(pedido_id)
        return self._repository.update_status(pedido, status.value)
