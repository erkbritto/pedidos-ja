# Pedido Já — Frontend

Interface web (SPA) do sistema **Pedido Já**, desenvolvida como parte do
**Trabalho 1 de Desenvolvimento de Sistemas Distribuídos**.

## Objetivo

Fornecer a interface de usuário para uma aplicação de gerenciamento de
pedidos:

- **Home (`/`)** — experiência do cliente: catálogo, criação de pedido,
  confirmação e consulta, tudo em uma única página;
- **Área Administrativa (`/admin`)** — acompanhar e alterar o status dos
  pedidos;
- **API & Documentação (`/api`)** — contrato HTTP consumido pela interface;
- **Arquitetura (`/arquitetura`)** — documentação didática da arquitetura
  acadêmica do projeto.

Este diretório contém **apenas o frontend**. Ele não implementa
persistência própria, autenticação, backend ou banco de dados.

## Contexto acadêmico

O backend (desenvolvido separadamente) segue a stack:

```text
Python + FastAPI + PostgreSQL + Docker Compose
```

com a arquitetura interna `API/Controller → Service → Repository →
PostgreSQL`. No runtime final da entrega existem apenas dois containers:

```text
pedidos    (FastAPI + esta SPA compilada)
postgres   (PostgreSQL)
```

Este frontend é compilado como arquivos estáticos (`npm run build` →
`dist/`) e servido pela aplicação FastAPI na raiz do mesmo serviço
(`http://localhost:8000/`).

> Os produtos exibidos na interface são opções estáticas de entrada para o
> domínio de Pedidos. Catálogo e Estoque não constituem serviços ou
> capacidades persistentes nesta primeira entrega.

## Stack

- React 19 + TypeScript
- Vite
- React Router DOM (SPA, sem SSR)
- TanStack Query (cache e sincronização de dados assíncronos)
- Tailwind CSS v4
- shadcn/ui (somente os componentes realmente utilizados)
- React Hook Form + Zod
- Lucide React (ícones)
- npm (gerenciador de pacotes único do projeto)

## Estrutura

```text
src/
  App.tsx                    # Providers (React Query, Router) e árvore de rotas
  main.tsx                   # Ponto de entrada Vite
  styles.css                 # Design tokens (Tailwind v4 + oklch)
  components/
    architecture/            # Diagrama e cartões da página de Arquitetura
    catalogo/                 # ProdutoCard, CatalogoProdutos, QuantidadeStepper
    common/                    # PageHeader, StatCard, estados de loading/erro/vazio, ErrorBoundary
    layout/                     # Brand, PublicHeader, SiteFooter, layouts de Admin/Técnico
    pedidos/                     # Tabela, card mobile, filtros, badge de status, detalhes, 404 de pedido
    ui/                           # Componentes shadcn/ui usados pelo projeto
  data/
    produtos.ts                    # Catálogo visual estático (não é backend/estoque)
  dev/
    mockApi.ts                      # Implementação em memória da mesma interface dos services reais
    mockData.ts                      # Dados de exemplo do modo de demonstração
  hooks/
    useHealth.ts                      # Query de GET /health
    usePedidos.ts                      # Queries/mutations de /pedidos
  lib/
    env.ts                               # Variáveis de ambiente e buildApiUrl()
    format.ts                             # Formatação de moeda, número e data em pt-BR
    pedido-id.ts                           # Validação de identificador de pedido
    utils.ts                                # Helper cn() (clsx + tailwind-merge)
  pages/
    HomePage.tsx                             # /  — catálogo + pedido + confirmação + consulta
    admin/                                     # /admin, .../pedidos, .../pedidos/:id
    ApiDocsPage.tsx                              # /api
    ArquiteturaPage.tsx                           # /arquitetura
    NotFoundPage.tsx                               # 404 da SPA
  schemas/
    pedido.ts                                       # Validação Zod do formulário de pedido
  services/api/
    client.ts                                        # Cliente HTTP (fetch + timeout + AbortController)
    health.ts, pedidos.ts                             # Chamadas específicas de cada recurso
  types/
    api.ts                                             # ApiError e utilitários de erro
    pedido.ts                                           # Tipos de domínio (não alterar)
```

## Rotas da interface

| Rota                 | Descrição                                                  |
| -------------------- | ---------------------------------------------------------- |
| `/`                  | Home — catálogo, criação de pedido, confirmação e consulta |
| `/admin`             | Painel administrativo (indicadores + pedidos recentes)     |
| `/admin/pedidos`     | Listagem completa, com busca e filtro locais               |
| `/admin/pedidos/:id` | Detalhes do pedido + alteração de status                   |
| `/api`               | Documentação do contrato HTTP consumido pela interface     |
| `/arquitetura`       | Documentação da arquitetura acadêmica do projeto           |

Qualquer outro caminho exibe a página de "Página não encontrada" (404 da
SPA), distinta do "Pedido não encontrado" (pedido inexistente) e do
"Número de pedido inválido" (ID malformado).

`/` é a experiência do cliente (catálogo, pedido, confirmação e consulta).
`/admin` é apenas uma separação de interface para acompanhar os pedidos —
**a Área Administrativa não representa autenticação ou autorização nesta
primeira entrega.** Qualquer pessoa com o link acessa `/admin` livremente.

A base da interface e a base da API são **conceitos independentes** — a
interface nunca monta chamadas HTTP sob o caminho das suas próprias
rotas.

## Catálogo visual (`/`)

A home apresenta um pequeno catálogo estático (`src/data/produtos.ts`)
para acelerar o preenchimento do pedido. Ele **não** é um serviço de
Catálogo nem de Estoque: são apenas quatro opções fixas no frontend, sem
endpoint, sem persistência e sem informação de disponibilidade. Ao
selecionar um item, os campos `produto` e `valor_unitario` do formulário
são preenchidos automaticamente; o cliente só informa o nome e a
quantidade.

## Endpoints esperados da API

A interface consome exclusivamente:

```text
GET   /health
POST  /pedidos
GET   /pedidos
GET   /pedidos/{id}
PATCH /pedidos/{id}/status
```

A documentação interativa (Swagger/OpenAPI) é exposta pela própria API em
`/docs` e acessada pela interface como um link técnico — não é uma rota
React nem um endpoint de negócio.

Nenhum outro endpoint é consumido (sem autenticação, sem CRUD de produtos
ou clientes, sem paginação de backend, sem `DELETE`/`PUT`).

## Variáveis de ambiente

Configuração oficial (arquivo `.env`, versionado):

```env
VITE_API_BASE_URL=
VITE_APP_BASE_PATH=/
VITE_USE_MOCKS=false
```

- **`VITE_API_BASE_URL`** — origem da API. Vazio significa "mesma
  origem" (cenário final, em que o FastAPI serve tanto a API quanto os
  arquivos estáticos da interface). **Não deve conter `localhost` no
  build de produção.**
- **`VITE_APP_BASE_PATH`** — prefixo em que a interface é montada. O
  padrão de produção é `/` (raiz). Controla, via `loadEnv` em
  `vite.config.ts`, tanto o `base` do build do Vite quanto o `basename`
  do React Router (lido de `import.meta.env.BASE_URL` em `src/lib/env.ts`,
  garantindo que os dois nunca fiquem dessincronizados). Nunca é usado
  para montar URLs de API.
- **`VITE_USE_MOCKS`** — habilita o modo de demonstração (dados fictícios
  em memória, sem qualquer chamada real à API). Deve permanecer `false`
  por padrão; só é útil para desenvolver a interface sem a API no ar.

Para desenvolvimento local, use `.env.local` (não versionado) para
sobrescrever a origem da API, por exemplo:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Desenvolvimento

Requer Node.js 20+ e npm.

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173/`.

## Modo de demonstração (mocks)

Com `VITE_USE_MOCKS=true`, a interface passa a usar `src/dev/mockApi.ts`
no lugar das chamadas HTTP reais. Os dados existem **somente em memória
enquanto a página estiver aberta** — não há `localStorage`,
`IndexedDB`, banco de dados ou qualquer outra forma de persistência, e um
recarregamento da página reinicia os dados para o estado inicial. Um
indicador "Modo de demonstração" é exibido na interface enquanto o modo
está ativo. A implementação dos mocks segue exatamente a mesma
assinatura dos serviços reais (`src/services/api/*`), então nenhuma
página precisa saber se está em modo real ou de demonstração.

## Build de produção

```bash
npm run typecheck
npm run lint
npm run build
```

O build gera apenas a pasta `dist/`, pronta para ser copiada para dentro
da imagem da aplicação FastAPI e servida na raiz desse serviço (por
exemplo, com `StaticFiles` montado em `/`, com fallback de SPA para
`index.html` em rotas não reconhecidas pela API).

Para pré-visualizar o build localmente:

```bash
npm run preview
```

## Scripts disponíveis

| Script              | Descrição                                              |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Sobe o servidor de desenvolvimento Vite                |
| `npm run typecheck` | Verifica tipos com `tsc --noEmit`                      |
| `npm run lint`      | Executa o ESLint                                       |
| `npm run build`     | Roda `typecheck` e gera o build de produção em `dist/` |
| `npm run preview`   | Serve o build de produção localmente                   |
| `npm run format`    | Formata o projeto com Prettier                         |

## Integração futura com FastAPI

Este diretório é independente do backend. A integração final consiste
em, no projeto FastAPI:

1. copiar o conteúdo de `dist/` para dentro da imagem da aplicação;
2. montar esses arquivos estáticos na raiz do serviço, com fallback de
   SPA (toda rota não reconhecida pela API deve servir `index.html`,
   para que o React Router assuma o roteamento client-side);
3. manter a API (`/health`, `/pedidos`, `/docs`, etc.) no mesmo serviço,
   já que em produção `VITE_API_BASE_URL` fica vazio (mesma origem).

**Observação:** este diretório não contém backend nem banco de dados —
apenas a interface web estática que consome a API por HTTP/JSON.
