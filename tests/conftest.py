"""Conftest raiz.

Garante que qualquer import de `app.*` durante a coleta de testes aponte
para o banco de teste, nunca para o banco de desenvolvimento — mesmo que um
teste unitário (que não toca o banco) importe algo de `app` primeiro.
"""

import os

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+psycopg://pedidos:pedidos@localhost:5432/pedidos_test",
)
