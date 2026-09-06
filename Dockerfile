# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — build da SPA (React + Vite). Node só existe nesta etapa; a imagem
# final (stage 2) não tem Node instalado.
# ---------------------------------------------------------------------------
FROM node:22-slim AS frontend-build

WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
# Configuração oficial de produção: mesma origem (API_BASE_URL vazio) e
# mocks desligados — o professor deve interagir com o PostgreSQL real.
ENV VITE_API_BASE_URL=""
ENV VITE_APP_BASE_PATH="/"
ENV VITE_USE_MOCKS="false"
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 — runtime Python. Sem Node, sem devDependencies do frontend.
# ---------------------------------------------------------------------------
FROM python:3.12-slim AS backend

WORKDIR /srv

RUN groupadd --system app && useradd --system --gid app --home /srv app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY alembic ./alembic
COPY alembic.ini ./alembic.ini
COPY --from=frontend-build /frontend/dist ./frontend/dist

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh && chown -R app:app /srv

USER app

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
