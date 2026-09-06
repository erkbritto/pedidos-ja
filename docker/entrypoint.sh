#!/bin/sh
# Entrypoint do serviço `pedidos`: aplica as migrations Alembic e só então
# inicia o Uvicorn. `depends_on` com healthcheck já garante que o Postgres
# está pronto antes deste container iniciar; o retry abaixo é apenas uma
# rede de segurança adicional (sem depender de `sleep N` como sincronização).

set -e

MAX_TENTATIVAS=10
TENTATIVA=1

until python -m alembic upgrade head; do
  if [ "$TENTATIVA" -ge "$MAX_TENTATIVAS" ]; then
    echo "Falha ao aplicar migrations após $MAX_TENTATIVAS tentativas." >&2
    exit 1
  fi
  echo "Banco ainda não disponível para migration (tentativa $TENTATIVA/$MAX_TENTATIVAS). Tentando novamente em 2s..."
  TENTATIVA=$((TENTATIVA + 1))
  sleep 2
done

exec python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
