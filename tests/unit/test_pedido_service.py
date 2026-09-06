from decimal import Decimal

import pytest

from app.models.pedido import Pedido
from app.schemas.pedido import PedidoCreate, PedidoStatus
from app.services.pedido_service import (
    PedidoNaoEncontradoError,
    PedidoService,
    calcular_valor_total,
)


class FakePedidoRepository:
    """Fake em memória com a mesma interface pública do PedidoRepository.

    Suficiente para testar o Service isoladamente, sem precisar de um banco
    de dados real nem de uma biblioteca de mocking.
    """

    def __init__(self) -> None:
        self._pedidos: dict[int, Pedido] = {}
        self._next_id = 1
        self.last_created: Pedido | None = None

    def create(self, pedido: Pedido) -> Pedido:
        pedido.id = self._next_id
        self._next_id += 1
        self._pedidos[pedido.id] = pedido
        self.last_created = pedido
        return pedido

    def get_by_id(self, pedido_id: int) -> Pedido | None:
        return self._pedidos.get(pedido_id)

    def list_all(self) -> list[Pedido]:
        return list(self._pedidos.values())

    def update_status(self, pedido: Pedido, status: str) -> Pedido:
        pedido.status = status
        return pedido


@pytest.fixture
def repo() -> FakePedidoRepository:
    return FakePedidoRepository()


@pytest.fixture
def service(repo: FakePedidoRepository) -> PedidoService:
    return PedidoService(repo)


def _dados(**overrides: object) -> PedidoCreate:
    base = {
        "cliente": "Ana Souza",
        "produto": "Combo de Hambúrguer",
        "quantidade": 2,
        "valor_unitario": Decimal("32.90"),
    }
    base.update(overrides)
    return PedidoCreate(**base)  # type: ignore[arg-type]


# --- cálculo de valor_total / Decimal -----------------------------------


def test_calcula_valor_total_com_decimal_preciso() -> None:
    assert calcular_valor_total(2, Decimal("32.90")) == Decimal("65.80")


def test_calcula_valor_total_retorna_decimal() -> None:
    resultado = calcular_valor_total(1, Decimal("10.00"))
    assert isinstance(resultado, Decimal)


def test_calcula_valor_total_normaliza_para_duas_casas_com_arredondamento() -> None:
    # 3 * 10.005 = 30.015 -> ROUND_HALF_UP -> 30.02
    assert calcular_valor_total(3, Decimal("10.005")) == Decimal("30.02")


# --- status inicial -------------------------------------------------------


def test_criar_pedido_define_status_inicial_criado(service: PedidoService) -> None:
    pedido = service.criar_pedido(_dados())
    assert pedido.status == PedidoStatus.CRIADO.value


def test_criar_pedido_calcula_valor_total_corretamente(service: PedidoService) -> None:
    pedido = service.criar_pedido(_dados(quantidade=2, valor_unitario=Decimal("32.90")))
    assert pedido.valor_total == Decimal("65.80")
    assert isinstance(pedido.valor_total, Decimal)


# --- normalização de cliente/produto --------------------------------------


def test_criar_pedido_normaliza_cliente_e_produto(service: PedidoService) -> None:
    pedido = service.criar_pedido(_dados(cliente="Ana Souza", produto="Combo de Hambúrguer"))
    assert pedido.cliente == "Ana Souza"
    assert pedido.produto == "Combo de Hambúrguer"


# --- comportamento do Service / Repository ---------------------------------


def test_criar_pedido_chama_repository_com_dados_corretos(
    service: PedidoService, repo: FakePedidoRepository
) -> None:
    service.criar_pedido(
        _dados(cliente="Bruno Lima", quantidade=3, valor_unitario=Decimal("18.90"))
    )

    assert repo.last_created is not None
    assert repo.last_created.cliente == "Bruno Lima"
    assert repo.last_created.quantidade == 3
    assert repo.last_created.valor_unitario == Decimal("18.90")
    assert repo.last_created.status == PedidoStatus.CRIADO.value


def test_buscar_pedido_existente_retorna_pedido(service: PedidoService) -> None:
    criado = service.criar_pedido(_dados())
    encontrado = service.buscar_pedido(criado.id)
    assert encontrado is criado


def test_buscar_pedido_inexistente_levanta_erro(service: PedidoService) -> None:
    with pytest.raises(PedidoNaoEncontradoError):
        service.buscar_pedido(999)


def test_listar_pedidos_retorna_todos(service: PedidoService) -> None:
    service.criar_pedido(_dados(produto="Hot Dog"))
    service.criar_pedido(_dados(produto="Batata Frita"))
    assert len(service.listar_pedidos()) == 2


def test_atualizar_status_altera_somente_o_status(service: PedidoService) -> None:
    criado = service.criar_pedido(_dados())
    atualizado = service.atualizar_status(criado.id, PedidoStatus.CONFIRMADO)

    assert atualizado.status == PedidoStatus.CONFIRMADO.value
    assert atualizado.cliente == criado.cliente
    assert atualizado.produto == criado.produto
    assert atualizado.quantidade == criado.quantidade
    assert atualizado.valor_total == criado.valor_total


def test_atualizar_status_pedido_inexistente_levanta_erro(service: PedidoService) -> None:
    with pytest.raises(PedidoNaoEncontradoError):
        service.atualizar_status(999, PedidoStatus.CANCELADO)
