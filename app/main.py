"""Ponto de entrada da aplicação `pedidos`.

Ordem de registro é intencional (ver seção 28 do enunciado): rotas da API
primeiro, depois assets estáticos, e só por último o catch-all da SPA —
garantindo que `/health`, `/pedidos*`, `/docs` e `/openapi.json` nunca sejam
capturados pelo fallback do React Router.
"""

import logging
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from app.api import health, pedidos
from app.config import get_settings

logger = logging.getLogger("pedidos")

settings = get_settings()

BASE_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = BASE_DIR / "frontend" / "dist"
ASSETS_DIR = DIST_DIR / "assets"

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "API de gerenciamento de Pedidos (Entrega 1). "
        "Um Pedido contém um único produto e uma quantidade — não há "
        "múltiplos itens, pagamento, estoque ou autenticação nesta entrega."
    ),
    docs_url="/docs",
    redoc_url=None,
    swagger_ui_oauth2_redirect_url=None,
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Content-Type"],
)

# 1) Rotas da API sempre primeiro.
app.include_router(health.router)
app.include_router(pedidos.router)


@app.get("/health/{invalid_path:path}", include_in_schema=False)
def invalid_health_path(invalid_path: str) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": "Rota não encontrada."})


@app.get("/pedidos/{invalid_path:path}", include_in_schema=False)
def invalid_pedido_path(invalid_path: str) -> JSONResponse:
    """Mantém erros de caminhos de pedidos como JSON, não como SPA."""
    return JSONResponse(status_code=404, content={"detail": "Rota não encontrada."})


@app.api_route("/docs/{invalid_path:path}", methods=["GET", "POST"], include_in_schema=False)
def invalid_docs_path(invalid_path: str) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": "Rota não encontrada."})


@app.api_route("/redoc", methods=["GET", "POST"], include_in_schema=False)
@app.api_route("/redoc/{invalid_path:path}", methods=["GET", "POST"], include_in_schema=False)
def invalid_redoc_path(invalid_path: str = "") -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": "Rota não encontrada."})


@app.api_route(
    "/openapi.json/{invalid_path:path}", methods=["GET", "POST"], include_in_schema=False
)
def invalid_openapi_path(invalid_path: str) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": "Rota não encontrada."})


# 2) Tratamento de erros: nunca expor stack trace, SQL ou detalhes internos.
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Erro não tratado ao processar %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Erro interno do servidor."})


# 3) Assets estáticos do build da SPA (JS/CSS com hash no nome do arquivo).
if ASSETS_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")


# 4) Catch-all da SPA — por último, de propósito. Serve arquivos estáticos
#    de nível raiz (favicon, robots.txt) quando existem e, para qualquer
#    outra rota não reconhecida pela API, devolve `index.html` para que o
#    React Router assuma o roteamento client-side (admin, produto, carrinho,
#    revisar, acompanhar, pedido/:id, etc.).
@app.get("/{full_path:path}", include_in_schema=False)
def serve_spa(full_path: str) -> FileResponse:
    index_file = DIST_DIR / "index.html"
    if not index_file.is_file():
        raise HTTPException(
            status_code=404,
            detail="Frontend não compilado. Rode o build da SPA antes de servir a aplicação.",
        )

    if full_path:
        candidate = (DIST_DIR / full_path).resolve()
        # Guarda contra path traversal (`..`) já que `full_path` vem do cliente.
        if candidate.is_file() and candidate.is_relative_to(DIST_DIR.resolve()):
            return FileResponse(candidate)

    return FileResponse(index_file)
