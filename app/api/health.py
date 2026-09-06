"""Endpoint de verificação de disponibilidade da aplicação."""

from fastapi import APIRouter

router = APIRouter(tags=["Saúde"])


@router.get(
    "/health",
    summary="Verifica se a aplicação está no ar",
    description="Endpoint mínimo de disponibilidade, sem dependência do banco de dados.",
    response_description="Aplicação disponível.",
)
def health_check() -> dict[str, str]:
    return {"status": "ok"}
