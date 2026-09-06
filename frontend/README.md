# Pedido Já: frontend

SPA React do Pedido Já. O build é servido pelo FastAPI a partir de
`frontend/dist`, na mesma origem da API. O frontend não possui banco,
autenticação ou persistência própria.

## Rotas

Público:

- `/`
- `/produto/:produtoId`
- `/carrinho`
- `/revisar`
- `/acompanhar`
- `/pedido/:id`

Admin:

- `/admin`
- `/admin/pedidos`
- `/admin/pedidos/:id`
- `/admin/api`
- `/admin/arquitetura`

## Stack e execução

React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS,
shadcn/ui e Lucide React. Use npm:

```bash
npm ci
npm run dev
```

Validação do build:

```bash
npm run typecheck
npm run lint
npm run build
```

## Integração

Em produção, a SPA usa a mesma origem e consome somente:

```text
GET /health
POST /pedidos
GET /pedidos
GET /pedidos/{id}
PATCH /pedidos/{id}/status
```

`VITE_API_BASE_URL` pode apontar para uma API local durante o desenvolvimento;
no Docker permanece vazio. `VITE_USE_MOCKS` deve permanecer `false` no build
oficial. O catálogo visual é estático e não representa estoque ou endpoint.
