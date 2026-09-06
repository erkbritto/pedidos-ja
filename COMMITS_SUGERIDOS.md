# Commits sugeridos

Nenhum commit, push, tag ou alteração no histórico Git foi executado por
mim. O `.git` do repositório permanece exatamente como estava. Esta lista é
apenas uma sugestão de como organizar as mudanças desta entrega em commits
coerentes, na ordem em que fazem sentido.

1. **`chore: reorganiza o repositório em monorepo (frontend/ + backend na raiz)`**
   - Move os arquivos do frontend (que ocupavam a raiz do repositório) para
     `frontend/`, preparando espaço para o backend na raiz.
   - Nenhuma mudança de conteúdo do frontend nesta etapa, só de localização.

2. **`feat: adiciona estrutura do backend FastAPI`**
   - `app/config.py`, `app/database.py` (engine/Session/Base/get_db).
   - `app/models/pedido.py` (modelo SQLAlchemy).
   - `app/schemas/pedido.py` (schemas Pydantic de entrada/saída,
     `field_serializer` para valores monetários como `number`).

3. **`feat: configura persistência PostgreSQL e migration inicial`**
   - `alembic.ini`, `alembic/env.py`, `alembic/script.py.mako`.
   - `alembic/versions/0001_create_pedidos_table.py` (tabela `pedidos` com
     CHECK constraints de status/quantidade/valores).

4. **`feat: implementa repository e service de pedidos`**
   - `app/repositories/pedido_repository.py`.
   - `app/services/pedido_service.py` (cálculo de `valor_total`, status
     inicial `CRIADO`, normalização de `cliente`/`produto`).

5. **`feat: implementa endpoints e health check`**
   - `app/api/health.py`, `app/api/pedidos.py`.
   - `app/main.py` (monta a app, CORS, exception handler genérico, SPA
     fallback registrado após as rotas da API).

6. **`test: adiciona testes do domínio e da API`**
   - `tests/conftest.py`, `tests/unit/test_pedido_service.py` (repository
     fake em memória).
   - `tests/integration/conftest.py`, `tests/integration/test_api_pedidos.py`
     (API completa via `TestClient` contra PostgreSQL real).

7. **`build: configura Docker Compose e build multi-stage`**
   - `Dockerfile` (stage Node para build da SPA, stage Python slim para
     runtime — sem Node na imagem final).
   - `docker/entrypoint.sh` (migration antes do Uvicorn).
   - `docker-compose.yml` (serviços `pedidos` e `postgres`, healthchecks,
     volume nomeado, Postgres sem porta publicada).
   - `.dockerignore`, `.env.example` (raiz), `requirements.txt`.

8. **`feat: integra frontend estático à FastAPI`**
   - Ajuste do serializer de valores monetários (`Decimal` → `number` no
     JSON) após detectar, em teste manual, que o Pydantic v2 emitia
     `Decimal` como string.
   - Validação end-to-end: SPA servida em `/`, rotas profundas (`/admin`,
     `/produto/:id`, etc.) resolvidas pelo fallback, API sempre
     respondendo antes do catch-all.

9. **`docs: documenta arquitetura, execução e persistência`**
   - `README.md` raiz (identificação, arquitetura, endpoints, execução via
     Docker, configuração, Alembic, persistência/restart, testes, decisões
     de implementação, limitações).
   - `.gitignore` raiz consolidado (Python + frontend).
   - Este arquivo, `COMMITS_SUGERIDOS.md`.

---

Após a revisão final do grupo, criar manualmente a tag `APIPedidos-1-final`
no commit correspondente a esta entrega (nenhuma tag foi criada
automaticamente).
