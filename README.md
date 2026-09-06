# Pedido Já

Sistema de gerenciamento de Pedidos — Trabalho de Desenvolvimento de Sistemas
Distribuídos (Entrega 1: API Pedidos + persistência + integração com a
interface web).

## Identificação

- **Disciplina:** Desenvolvimento de Sistemas Distribuídos
- **Trabalho:** Entrega 1 — API Pedidos
- **Integrantes:** _(preencher com os nomes do grupo antes da entrega —
  nenhum nome foi informado nos materiais recebidos, então nenhum foi
  inventado aqui)_

## Objetivo

Implementar uma aplicação de gerenciamento de Pedidos composta por:

1. uma **API HTTP** (FastAPI) que expõe operações de criação, consulta,
   listagem e atualização de status de Pedidos;
2. uma camada de **persistência real** em PostgreSQL, versionada via
   Alembic;
3. uma **interface web** (SPA React) que consome essa API para permitir
   que um cliente monte e acompanhe pedidos, e que um administrador
   acompanhe e atualize o status desses pedidos.

Cada Pedido representa a compra de **um único produto** com uma
**quantidade**, sem múltiplos itens por pedido, sem carrinho persistido no
servidor, sem pagamento, sem estoque e sem autenticação — esse escopo é
proposital para a Entrega 1 (ver [Limitações](#limitações-da-entrega-1)).

## Arquitetura

### Visão física (containers)

```text
┌──────────────────────────┐        ┌──────────────────────────┐
│   container: pedidos     │  SQL   │   container: postgres    │
│  FastAPI + SPA compilada │◄──────►│        PostgreSQL 16      │
│     (porta 8000)         │        │  (sem porta publicada)    │
└──────────────────────────┘        └──────────────────────────┘
            ▲
            │ HTTP/JSON (same-origin)
            │
      Navegador do cliente
```

Apenas dois serviços Docker existem: `pedidos` e `postgres`. O
PostgreSQL **não** publica a porta 5432 no host — só é alcançável pela
rede interna do Compose, pelo hostname `postgres`.

### Visão interna da aplicação `pedidos`

```text
Requisição HTTP
      │
      ▼
┌─────────────┐     ┌─────────┐     ┌────────────┐     ┌────────────┐
│ API/Router  │ ──► │ Service │ ──► │ Repository │ ──► │ PostgreSQL │
│ (app/api)   │     │(app/    │     │ (app/      │     │            │
│             │     │services)│     │repositories│     │            │
└─────────────┘     └─────────┘     └────────────┘     └────────────┘
```

- **API/Router** (`app/api/`): recebe a requisição HTTP, valida o corpo via
  schemas Pydantic, delega ao Service e traduz o resultado (ou erro) em uma
  resposta HTTP. Não contém lógica de negócio nem SQL.
- **Service** (`app/services/pedido_service.py`): concentra as regras da
  aplicação — cálculo de `valor_total`, definição do status inicial
  (`CRIADO`), normalização de `cliente`/`produto`. É a única camada que
  decide _o que_ acontece; não sabe nada sobre HTTP.
- **Repository** (`app/repositories/pedido_repository.py`): única camada
  que conhece SQLAlchemy/SQL. Operações de persistência (`create`,
  `get_by_id`, `list_all`, `update_status`).
- **PostgreSQL**: fonte de verdade dos dados. Nada é mantido em memória do
  processo Python entre requisições.

O frontend estático (React, compilado com Vite) é servido pela própria
aplicação FastAPI a partir de `frontend/dist`, na mesma origem da API —
não existe um servidor HTTP separado para a interface.

## Estrutura do repositório

```text
.
├── app/                      # Backend FastAPI
│   ├── api/                    # Routers HTTP (health, pedidos)
│   ├── services/                 # Regras de negócio (PedidoService)
│   ├── repositories/               # Acesso a dados (PedidoRepository)
│   ├── models/                       # Modelos SQLAlchemy (ORM)
│   ├── schemas/                        # Schemas Pydantic (entrada/saída)
│   ├── config.py                         # Configuração via variáveis de ambiente
│   ├── database.py                        # Engine, Session, Base, get_db
│   └── main.py                             # Monta a app, CORS, rotas, SPA fallback
├── alembic/                  # Migrations (schema versionado do banco)
│   └── versions/
├── tests/
│   ├── unit/                   # PedidoService com repository fake
│   └── integration/              # API completa via TestClient + Postgres real
├── frontend/                 # SPA React + TypeScript + Vite (ver frontend/README.md)
├── docker/
│   └── entrypoint.sh          # Aplica migrations e sobe o Uvicorn
├── Dockerfile                 # Build multi-stage (Node → build da SPA; Python → runtime)
├── docker-compose.yml         # Serviços `pedidos` e `postgres`
├── requirements.txt           # Dependências Python fixadas
├── alembic.ini
├── .env.example                # Referência de variáveis (não é copiado automaticamente)
├── COMMITS_SUGERIDOS.md        # Sugestão de organização de commits (nada foi commitado)
└── README.md                   # Este arquivo
```

## Tecnologias

**Backend**

- Python 3.12
- FastAPI + Uvicorn
- SQLAlchemy 2.x (ORM)
- Pydantic v2 (validação/serialização)
- Alembic (migrations)
- psycopg 3 (driver PostgreSQL)
- pytest + httpx (testes)
- Ruff (lint)

**Persistência**

- PostgreSQL 16

**Frontend** (ver detalhes em [`frontend/README.md`](frontend/README.md))

- React 19 + TypeScript + Vite
- React Router DOM, TanStack Query
- Tailwind CSS v4, shadcn/ui

**Infraestrutura**

- Docker + Docker Compose (build multi-stage; Node não existe na imagem final)

## Modelo de Pedido

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | inteiro | gerado pelo banco (autoincrement) |
| `cliente` | texto | obrigatório, não vazio |
| `produto` | texto | obrigatório, não vazio |
| `quantidade` | inteiro | obrigatório, ≥ 1 |
| `valor_unitario` | decimal (2 casas) | obrigatório, > 0 |
| `valor_total` | decimal (2 casas) | **calculado pela aplicação** (`quantidade × valor_unitario`) — nunca aceito na entrada |
| `status` | texto | `CRIADO` \| `CONFIRMADO` \| `CANCELADO`; inicia sempre como `CRIADO` |
| `data_criacao` | timestamp | preenchido pelo banco no momento da criação |

`id`, `valor_total`, `status` inicial e `data_criacao` nunca são aceitos
como entrada — são sempre decididos pela aplicação.

## Endpoints

| Método | Caminho | Descrição | Sucesso | Erros |
| --- | --- | --- | --- | --- |
| GET | `/health` | Disponibilidade da aplicação | 200 | — |
| POST | `/pedidos` | Cria um pedido | 201 | 422 |
| GET | `/pedidos` | Lista todos os pedidos | 200 | — |
| GET | `/pedidos/{id}` | Consulta um pedido | 200 | 404 |
| PATCH | `/pedidos/{id}/status` | Atualiza somente o status | 200 | 404, 422 |

Documentação interativa (Swagger/OpenAPI) gerada automaticamente pelo
FastAPI em `/docs` (UI) e `/openapi.json` (schema).

Nenhum outro endpoint de negócio existe: sem autenticação, sem CRUD de produtos,
sem paginação, sem `DELETE`/`PUT`.

## Como executar (Docker — forma oficial)

Pré-requisito: apenas Docker e Docker Compose instalados. **Não** é
necessário instalar Node, Python ou PostgreSQL localmente, nem copiar
`.env.example` para `.env`, nem criar o banco manualmente — tudo isso é
feito pelo Compose/entrypoint.

```bash
docker compose up -d --build
```

Isso vai:

1. construir a imagem `pedidos` em duas etapas (build da SPA com Node,
   depois runtime Python sem Node);
2. subir o PostgreSQL e aguardar seu healthcheck (`pg_isready`);
3. aplicar as migrations do Alembic (`alembic upgrade head`) antes de
   iniciar o Uvicorn;
4. expor a aplicação completa (API + interface) em `http://localhost:8000/`.

### URLs

| URL | Conteúdo |
| --- | --- |
| `http://localhost:8000/` | Interface web (home do cliente) |
| `http://localhost:8000/admin` | Área administrativa |
| `http://localhost:8000/pedidos` | API de Pedidos (ver tabela de [Endpoints](#endpoints)) |
| `http://localhost:8000/docs` | Swagger UI |
| `http://localhost:8000/openapi.json` | Schema OpenAPI |
| `http://localhost:8000/health` | Health check |

Rotas React funcionam diretamente por URL (não apenas navegando pela SPA),
pois a API é registrada antes do fallback da SPA no `app/main.py`:
`/`, `/produto/:produtoId`, `/carrinho`, `/revisar`, `/acompanhar`,
`/pedido/:id`, `/admin`, `/admin/pedidos`, `/admin/pedidos/:id`,
`/admin/api`, `/admin/arquitetura`.

Para parar: `docker compose stop`. Para parar e remover os containers
(mantendo o volume do banco): `docker compose down`. **Evite**
`docker compose down -v` — isso apaga o volume `postgres_data` e, com
ele, todos os pedidos.

## Configuração

Variáveis de ambiente do backend (todas com default de laboratório —
funcionam sem nenhum arquivo `.env`, mas podem ser sobrescritas):

| Variável | Default (Compose) | Descrição |
| --- | --- | --- |
| `DATABASE_URL` | obrigatória | String de conexão do PostgreSQL |
| `CORS_ORIGINS` | `http://localhost:5173` | Origens extras liberadas para CORS (dev do frontend separado) |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | `pedidos` / `pedidos` / `pedidos` | Credenciais do container `postgres` |

Veja `.env.example` na raiz para referência (não é copiado
automaticamente — o Compose já define os mesmos defaults).

O frontend, por sua vez, é compilado no Docker com configuração
**same-origin** (`VITE_API_BASE_URL=` vazio, `VITE_APP_BASE_PATH=/`,
`VITE_USE_MOCKS=false`) — não há `localhost` embutido no bundle final.
Detalhes em [`frontend/README.md`](frontend/README.md).

## Alembic (migrations)

O schema do banco é versionado — nunca criado via
`Base.metadata.create_all()` em produção. A migration inicial
(`alembic/versions/0001_create_pedidos_table.py`) cria a tabela `pedidos`
com CHECK constraints para `status`, `quantidade` e os valores monetários.

O container `pedidos` roda `alembic upgrade head` automaticamente antes de
iniciar o Uvicorn (ver `docker/entrypoint.sh`). Para rodar manualmente
(ex.: desenvolvimento local fora do Docker):

```bash
export DATABASE_URL=postgresql+psycopg://pedidos:pedidos@localhost:5432/pedidos
alembic upgrade head
```

## Persistência e procedimento de restart

Os dados vivem no volume Docker nomeado `postgres_data`, independente do
ciclo de vida do container `pedidos`. Para comprovar:

```bash
# 1. Criar um pedido e guardar o id retornado
curl -s -X POST http://localhost:8000/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Ana Souza","produto":"Combo de Hambúrguer","quantidade":2,"valor_unitario":32.90}'

# 2. Reiniciar somente o container da aplicação (o Postgres não é afetado)
docker compose restart pedidos

# 3. Consultar o mesmo id — o pedido continua existindo
curl -s http://localhost:8000/pedidos/<id>
```

`docker compose restart pedidos` reinicia apenas o container `pedidos`; o
`postgres` continua rodando ininterruptamente, e o volume `postgres_data`
nunca é tocado por esse comando.

## Testes

```bash
# Requer um PostgreSQL acessível (local ou via Docker) e TEST_DATABASE_URL
# apontando para um banco de TESTE (nunca o de desenvolvimento).
pip install -r requirements.txt
export TEST_DATABASE_URL=postgresql+psycopg://pedidos:pedidos@localhost:5432/pedidos_test
pytest
ruff check .
```

Os testes usam exclusivamente `TEST_DATABASE_URL`. O nome do banco de teste
deve terminar em `_test`; a configuração recusa o banco de desenvolvimento
para evitar apagar dados reais durante o isolamento dos testes.

- `tests/unit/`: `PedidoService` isolado, com um repository fake em
  memória (sem banco) — cálculo de `valor_total` com `Decimal`, status
  inicial, normalização de `cliente`/`produto`, delegação ao repository.
- `tests/integration/`: API completa via `TestClient`, contra um
  PostgreSQL real (schema aplicado por Alembic, nunca `create_all()`) —
  os 5 endpoints, validações (422), não encontrado (404), e a garantia de
  que o `PATCH` de status não altera nenhum outro campo.

## Decisões de implementação

- **Camadas explícitas** (API → Service → Repository) mesmo em um escopo
  pequeno: facilita testar o Service isoladamente e deixa claro onde cada
  regra vive.
- **`valor_total` sempre calculado no Service**, nunca aceito do cliente —
  e sempre com `Decimal` (nunca `float`) para evitar erro de
  arredondamento em valores monetários; a serialização Pydantic converte
  `Decimal` para número JSON (não string) via `field_serializer` explícito,
  para casar exatamente com o tipo `number` esperado pelo frontend.
- **Status como `VARCHAR` + `CHECK constraint`**, não `ENUM` nativo do
  Postgres: evolução do conjunto de status não exige `ALTER TYPE`.
- **Erros nunca vazam detalhes internos**: um handler genérico de exceção
  devolve sempre `{"detail": "Erro interno do servidor."}` com HTTP 500,
  registrando o stack trace apenas no log do servidor.
- **SPA servida pela própria API** (same-origin): elimina CORS em
  produção e simplifica o deploy a dois containers.
- **API sempre registrada antes do catch-all da SPA**: `/health`,
  `/pedidos*`, `/docs` e `/openapi.json` nunca são interceptados pelo
  fallback de `index.html`.

## Limitações da Entrega 1

Por escopo, propositalmente **não** existem nesta entrega:

- autenticação, autorização, login, JWT ou usuários;
- múltiplos itens por pedido, carrinho persistido no servidor ou
  pagamento;
- estoque, disponibilidade ou CRUD de produtos no backend (o catálogo
  exibido na interface é uma lista estática do frontend, não um serviço);
- paginação, filtros no servidor ou `DELETE`/`PUT` de pedidos;
- qualquer mecanismo de deploy além de `docker compose up -d --build`.

## Próximos passos manuais (fora do escopo desta entrega)

Após revisão do grupo, criar manualmente a tag `APIPedidos-1-final` no
commit final desta entrega. Nenhuma tag foi criada automaticamente.
