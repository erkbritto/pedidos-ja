import subprocess
import sys
from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text

ROOT_DIR = Path(__file__).resolve().parent.parent.parent


@pytest.fixture(scope="session", autouse=True)
def _aplicar_migrations() -> None:
    """Garante o schema mais recente no banco de teste via Alembic.

    Deliberadamente não usa `Base.metadata.create_all()` — o mecanismo
    oficial de schema deste projeto é o Alembic, inclusive em testes.
    """
    subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        check=True,
        cwd=ROOT_DIR,
    )


@pytest.fixture(autouse=True)
def _banco_limpo() -> Iterator[None]:
    """Isola cada teste: trunca a tabela antes de cada execução."""
    from app.database import engine

    with engine.begin() as connection:
        connection.execute(text("TRUNCATE TABLE pedidos RESTART IDENTITY"))
    yield


@pytest.fixture
def client() -> TestClient:
    from app.main import app

    return TestClient(app)


@pytest.fixture
def spa_dist(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    """Fornece uma SPA/assets mínimos sem depender do build do frontend."""
    dist_dir = tmp_path / "dist"
    products_dir = dist_dir / "products"
    products_dir.mkdir(parents=True)
    (dist_dir / "index.html").write_text(
        "<!doctype html><html><body>SPA de teste</body></html>", encoding="utf-8"
    )
    (products_dir / "combo-hamburguer.jpg").write_bytes(b"\xff\xd8\xff\xd9")

    import app.main as main_module

    monkeypatch.setattr(main_module, "DIST_DIR", dist_dir)
    monkeypatch.setattr(main_module, "ASSETS_DIR", dist_dir / "assets")
    return dist_dir
