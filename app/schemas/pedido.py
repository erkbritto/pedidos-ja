"""Schemas Pydantic (v2) do domínio `Pedido`.

Schemas de entrada (`PedidoCreate`, `PedidoStatusUpdate`) e de saída
(`PedidoResponse`) são deliberadamente separados: o cliente nunca envia
`id`, `valor_total`, `status` inicial ou `data_criacao`.
"""

from datetime import datetime
from decimal import Decimal
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, field_serializer, field_validator


class PedidoStatus(StrEnum):
    """Estados possíveis de um Pedido — nenhum outro é aceito."""

    CRIADO = "CRIADO"
    CONFIRMADO = "CONFIRMADO"
    CANCELADO = "CANCELADO"


class PedidoCreate(BaseModel):
    """Corpo aceito por `POST /pedidos`."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    cliente: str = Field(min_length=1, max_length=120, examples=["Ana Souza"])
    produto: str = Field(min_length=1, max_length=120, examples=["Combo de Hambúrguer"])
    quantidade: int = Field(ge=1, examples=[2])
    valor_unitario: Decimal = Field(gt=0, decimal_places=2, examples=[Decimal("32.90")])

    @field_validator("cliente", "produto")
    @classmethod
    def _nao_pode_ser_vazio_apos_trim(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Este campo não pode ser vazio.")
        return value.strip()


class PedidoStatusUpdate(BaseModel):
    """Corpo aceito por `PATCH /pedidos/{id}/status`."""

    model_config = ConfigDict(extra="forbid")

    status: PedidoStatus


class PedidoResponse(BaseModel):
    """Representação de um Pedido devolvida pela API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    cliente: str
    produto: str
    quantidade: int
    valor_unitario: Decimal
    valor_total: Decimal
    status: PedidoStatus
    data_criacao: datetime

    @field_serializer("valor_unitario", "valor_total")
    def _serializar_decimal_como_numero(self, value: Decimal) -> float:
        """Serializa Decimal como número JSON (não string).

        O frontend (`src/types/pedido.ts`) trata `valor_unitario`/`valor_total`
        como `number`. Sem este serializer, o Pydantic v2 emite Decimal como
        string em JSON, o que quebraria o contrato consumido pela SPA.
        """
        return float(value)
