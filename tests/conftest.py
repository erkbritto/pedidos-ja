"""Conftest raiz.

Garante que qualquer import de `app.*` durante a coleta de testes aponte
para o banco de teste, nunca para o banco de desenvolvimento — mesmo que um
teste unitário (que não toca o banco) importe algo de `app` primeiro.
"""

import os


def configure_test_database() -> str:
    test_database_url = os.environ.get("TEST_DATABASE_URL")
    if not test_database_url:
        raise RuntimeError("Defina TEST_DATABASE_URL para executar os testes de backend")
    if not test_database_url.rsplit("/", 1)[-1].split("?", 1)[0].endswith("_test"):
        raise RuntimeError("TEST_DATABASE_URL deve apontar para um banco terminado em _test")
    os.environ["DATABASE_URL"] = test_database_url
    return test_database_url


configure_test_database()
