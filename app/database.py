"""Configuração do SQLAlchemy: engine, fábrica de sessões e dependência FastAPI.

A engine é criada uma única vez por processo (nunca por requisição).
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    """Classe base declarativa (SQLAlchemy 2.x) para todos os modelos ORM."""


def get_db() -> Generator[Session, None, None]:
    """Dependência FastAPI: fornece uma sessão por requisição e a fecha ao final."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
