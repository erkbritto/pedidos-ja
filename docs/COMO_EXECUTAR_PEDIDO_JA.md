# Execução do Projeto — Pedido Já

Este guia contém apenas o necessário para executar e validar o projeto em uma máquina nova.

---

## 1. Pré-requisitos

A máquina precisa ter:

- **Git**
- **Docker**
- **Docker Compose**

No Windows, recomenda-se utilizar o **Docker Desktop**.

Não é necessário instalar manualmente:

- Python
- Node.js
- PostgreSQL
- dependências `pip`
- dependências `npm`

Toda a aplicação é preparada pelo Docker.

---

## 2. Clonar o repositório

Abra um terminal.

### Windows — PowerShell

```powershell
git clone https://github.com/erkbritto/pedidos-ja.git
cd pedidos-ja
```

### Linux / macOS

```bash
git clone https://github.com/erkbritto/pedidos-ja.git
cd pedidos-ja
```

---

## 3. Acessar a versão da entrega

A versão oficial da Entrega 1 é identificada pela tag:

```text
APIPedidos-1-final
```

Execute:

```bash
git checkout APIPedidos-1-final
```

Confirme:

```bash
git status
```

O Git deve informar que o repositório está no commit correspondente à tag da entrega.

---

## 4. Iniciar o sistema

Na **raiz do repositório**, onde está o arquivo:

```text
docker-compose.yml
```

execute:

```bash
docker compose up -d --build
```

Esse único comando:

1. constrói o frontend React;
2. prepara o backend FastAPI;
3. sobe o PostgreSQL 16;
4. aguarda o banco ficar saudável;
5. executa as migrations do Alembic;
6. inicia a API;
7. disponibiliza o frontend e a API na porta `8000`.

Nenhuma configuração manual do banco é necessária.

---

## 5. Verificar os containers

Execute:

```bash
docker compose ps
```

Devem existir somente os serviços:

```text
pedidos
postgres
```

Os dois devem aparecer como ativos.

O serviço `pedidos` deve publicar a porta:

```text
8000
```

O PostgreSQL utiliza a porta `5432` apenas dentro da rede Docker e não precisa ser acessado diretamente pela máquina host.

---

## 6. Testar o health check

### Windows — PowerShell

```powershell
curl.exe http://localhost:8000/health
```

### Linux / macOS

```bash
curl http://localhost:8000/health
```

Resposta esperada:

```json
{"status":"ok"}
```

---

## 7. Acessar o sistema

Abra no navegador:

### Interface do cliente

```text
http://localhost:8000
```

### Área administrativa

```text
http://localhost:8000/admin
```

### Swagger / documentação da API

```text
http://localhost:8000/docs
```

### OpenAPI

```text
http://localhost:8000/openapi.json
```

### Health check

```text
http://localhost:8000/health
```

---

## 8. Teste funcional rápido

Na interface principal:

1. escolha um produto;
2. selecione uma quantidade;
3. avance para revisão;
4. informe o nome do cliente;
5. confirme o pedido.

O pedido deve ser criado com status inicial:

```text
CRIADO
```

Na área administrativa:

```text
http://localhost:8000/admin
```

é possível visualizar o pedido e alterar seu status para:

```text
CONFIRMADO
```

ou:

```text
CANCELADO
```

---

## 9. Endpoints disponíveis

| Método | Endpoint | Função |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `POST` | `/pedidos` | Criar pedido |
| `GET` | `/pedidos` | Listar pedidos |
| `GET` | `/pedidos/{id}` | Consultar pedido |
| `PATCH` | `/pedidos/{id}/status` | Atualizar status |

A documentação interativa está disponível em:

```text
http://localhost:8000/docs
```

---

## 10. Testar persistência

Crie um pedido pela interface ou pelo Swagger.

Depois reinicie apenas a aplicação:

```bash
docker compose restart pedidos
```

Aguarde alguns segundos e teste novamente:

### Windows

```powershell
curl.exe http://localhost:8000/health
```

### Linux / macOS

```bash
curl http://localhost:8000/health
```

Abra novamente o pedido criado.

Ele deve continuar existindo, pois os dados ficam persistidos no PostgreSQL.

---

## 11. Verificar separação entre aplicação e banco

Pare somente a aplicação:

```bash
docker compose stop pedidos
```

Confira:

```bash
docker compose ps
```

O serviço `postgres` deve continuar ativo.

Inicie novamente a aplicação:

```bash
docker compose start pedidos
```

Depois:

```bash
docker compose ps
```

O pedido criado anteriormente deve continuar disponível.

---

## 12. Consultar o PostgreSQL

Para listar as tabelas:

```bash
docker compose exec postgres psql -U pedidos -d pedidos -c "\dt"
```

Devem aparecer:

```text
pedidos
alembic_version
```

Para visualizar os pedidos:

```bash
docker compose exec postgres psql -U pedidos -d pedidos -c "SELECT id, cliente, produto, quantidade, valor_unitario, valor_total, status, data_criacao FROM pedidos ORDER BY id;"
```

Para visualizar a migration aplicada:

```bash
docker compose exec postgres psql -U pedidos -d pedidos -c "SELECT * FROM alembic_version;"
```

---

## 13. Encerrar o sistema

Para parar e remover os containers, preservando os dados:

```bash
docker compose down
```

### Atenção

Evite:

```bash
docker compose down -v
```

O parâmetro `-v` remove o volume do PostgreSQL e apaga os pedidos persistidos.

---

## 14. Em caso de erro

### Verificar containers

```bash
docker compose ps
```

### Logs da aplicação

```bash
docker compose logs pedidos --tail 100
```

### Logs do PostgreSQL

```bash
docker compose logs postgres --tail 100
```

### Recriar os containers

```bash
docker compose down
docker compose up -d --build
```

---

## 15. Execução resumida

Para uma máquina nova, o fluxo completo é:

```bash
git clone https://github.com/erkbritto/pedidos-ja.git
cd pedidos-ja
git checkout APIPedidos-1-final
docker compose up -d --build
```

Depois, acessar:

```text
http://localhost:8000
```

E validar:

```text
http://localhost:8000/health
http://localhost:8000/docs
http://localhost:8000/admin
```

---

## Resultado esperado

Após executar:

```bash
docker compose up -d --build
```

a solução deve estar disponível integralmente em:

```text
http://localhost:8000
```

sem instalação manual de Python, Node.js ou PostgreSQL.
