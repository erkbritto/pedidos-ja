import os

from tests.conftest import configure_test_database


def test_testes_usam_sempre_a_url_de_teste() -> None:
    test_database_url = os.environ["TEST_DATABASE_URL"]
    assert test_database_url.endswith("_test")
    assert os.environ["DATABASE_URL"] == test_database_url


def test_configuracao_substitui_database_url_preexistente(monkeypatch) -> None:
    test_database_url = "postgresql+psycopg://pedidos:pedidos@localhost:5432/outro_test"
    monkeypatch.setenv("TEST_DATABASE_URL", test_database_url)
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://pedidos:pedidos@localhost:5432/dev")

    assert configure_test_database() == test_database_url
    assert os.environ["DATABASE_URL"] == test_database_url
