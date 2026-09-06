"""Configuração da aplicação, lida a partir de variáveis de ambiente.

Nenhuma credencial ou host é hard-coded no código Python: tudo vem de
``DATABASE_URL``/``CORS_ORIGINS`` (com defaults de laboratório apenas para
não obrigar o aluno a criar um ``.env`` manualmente).
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações da aplicação `pedidos`."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Pedido Já — API de Pedidos"
    app_version: str = "1.0.0"

    database_url: str

    # Origens extras liberadas para CORS (uso local com `npm run dev` na
    # porta 5173). Em produção same-origin, CORS nem é exercitado pelo
    # navegador para chamadas same-origin.
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Settings é cacheada — lida uma única vez por processo."""
    return Settings()
