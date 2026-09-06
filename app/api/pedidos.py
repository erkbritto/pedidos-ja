"""Endpoints HTTP de Pedidos.

Responsabilidade exclusiva desta camada: HTTP (path/body, status code,
response model) e delegação para `PedidoService`. Nenhum cálculo de
`valor_total`, SQL ou regra de negócio acontece aqui.
"""

import re

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.pedido_repository import PedidoRepository
from app.schemas.pedido import PedidoCreate, PedidoResponse, PedidoStatusUpdate
from app.services.pedido_service import PedidoNaoEncontradoError, PedidoService

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

PEDIDO_NAO_ENCONTRADO = {"description": "Pedido não encontrado."}
ID_PEDIDO_INVALIDO = "O id do pedido deve ser um inteiro positivo."


def parse_pedido_id(pedido_id: str) -> int:
    """Valida IDs sem permitir coerção numérica permissiva do FastAPI."""
    if not re.fullmatch(r"[0-9]+", pedido_id):
        raise HTTPException(status_code=422, detail=ID_PEDIDO_INVALIDO)
    parsed_id = int(pedido_id)
    if parsed_id <= 0 or parsed_id.bit_length() > 63:
        raise HTTPException(status_code=422, detail=ID_PEDIDO_INVALIDO)
    return parsed_id


def get_pedido_service(db: Session = Depends(get_db)) -> PedidoService:
    """Monta o Service com sua dependência (Repository) para esta requisição."""
    return PedidoService(PedidoRepository(db))


@router.post(
    "",
    response_model=PedidoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Cria um novo pedido",
    description=(
        "Recebe cliente, produto, quantidade e valor unitário. "
        "A aplicação calcula `valor_total`, define o status inicial como "
        "`CRIADO` e preenche `id`/`data_criacao` — nenhum desses campos é "
        "aceito na entrada."
    ),
)
def criar_pedido(
    dados: PedidoCreate, service: PedidoService = Depends(get_pedido_service)
) -> PedidoResponse:
    pedido = service.criar_pedido(dados)
    return PedidoResponse.model_validate(pedido)


@router.get(
    "",
    response_model=list[PedidoResponse],
    summary="Lista todos os pedidos",
    description="Retorna a coleção completa de pedidos, sem paginação.",
)
def listar_pedidos(service: PedidoService = Depends(get_pedido_service)) -> list[PedidoResponse]:
    pedidos = service.listar_pedidos()
    return [PedidoResponse.model_validate(pedido) for pedido in pedidos]


@router.get(
    "/{pedido_id}",
    response_model=PedidoResponse,
    summary="Consulta um pedido pelo id",
    responses={404: PEDIDO_NAO_ENCONTRADO},
)
def obter_pedido(
    pedido_id: str, service: PedidoService = Depends(get_pedido_service)
) -> PedidoResponse:
    pedido_id_int = parse_pedido_id(pedido_id)
    try:
        pedido = service.buscar_pedido(pedido_id_int)
    except PedidoNaoEncontradoError as exc:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.") from exc
    return PedidoResponse.model_validate(pedido)


@router.patch(
    "/{pedido_id}/status",
    response_model=PedidoResponse,
    summary="Atualiza somente o status de um pedido",
    description="Altera exclusivamente o campo `status`. Os demais dados do pedido não mudam.",
    responses={404: PEDIDO_NAO_ENCONTRADO},
)
def atualizar_status_pedido(
    pedido_id: str,
    dados: PedidoStatusUpdate,
    service: PedidoService = Depends(get_pedido_service),
) -> PedidoResponse:
    pedido_id_int = parse_pedido_id(pedido_id)
    try:
        pedido = service.atualizar_status(pedido_id_int, dados.status)
    except PedidoNaoEncontradoError as exc:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.") from exc
    return PedidoResponse.model_validate(pedido)
