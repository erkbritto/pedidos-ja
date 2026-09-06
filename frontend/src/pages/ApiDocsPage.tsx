import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ApiStatusBadge } from "@/components/common/ApiStatusBadge";
import { EndpointTable } from "@/components/pedidos/EndpointTable";
import { Button } from "@/components/ui/button";
import { API_DOCS_URL } from "@/lib/env";

const requestExample = `POST /pedidos
Content-Type: application/json

{
  "cliente": "Ana Souza",
  "produto": "Combo de Hambúrguer",
  "quantidade": 2,
  "valor_unitario": 32.90
}`;

const responseExample = `HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "cliente": "Ana Souza",
  "produto": "Combo de Hambúrguer",
  "quantidade": 2,
  "valor_unitario": 32.90,
  "valor_total": 65.80,
  "status": "CRIADO",
  "data_criacao": "2026-08-30T18:30:00Z"
}`;

const httpCodes = [
  { code: 201, meaning: "Criação de pedido com sucesso." },
  { code: 200, meaning: "Consultas, listagem, alteração de status e health." },
  { code: 404, meaning: "Recurso ou pedido inexistente." },
  { code: 422, meaning: "Validação, payload ou status inválido." },
] as const;

export function ApiDocsPage() {
  useEffect(() => {
    document.title = "API & Documentação — Pedido Já";
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader
        title="API & Documentação"
        description="Contrato HTTP utilizado pelo Pedido Já."
      />

      <section aria-labelledby="visao-geral" className="space-y-3">
        <h2 id="visao-geral" className="text-lg font-semibold text-foreground">
          Visão geral
        </h2>
        <dl className="grid gap-3 rounded-lg border border-border bg-card p-5 shadow-subtle sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Protocolo</dt>
            <dd className="text-sm font-medium text-foreground">HTTP</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Representação</dt>
            <dd className="text-sm font-medium text-foreground">JSON</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Documentação automática</dt>
            <dd className="text-sm font-medium text-foreground">OpenAPI</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="endpoints" className="space-y-3">
        <h2 id="endpoints" className="text-lg font-semibold text-foreground">
          Endpoints
        </h2>
        <EndpointTable />
      </section>

      <section aria-labelledby="exemplos" className="space-y-3">
        <h2 id="exemplos" className="text-lg font-semibold text-foreground">
          Exemplo — POST /pedidos
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Requisição
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-mono text-xs leading-relaxed text-foreground">
              {requestExample}
            </pre>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Resposta
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-mono text-xs leading-relaxed text-foreground">
              {responseExample}
            </pre>
          </div>
        </div>
      </section>

      <section aria-labelledby="codigos" className="space-y-3">
        <h2 id="codigos" className="text-lg font-semibold text-foreground">
          Códigos HTTP
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {httpCodes.map(({ code, meaning }) => (
            <li
              key={code}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm shadow-subtle"
            >
              <span className="font-mono text-sm font-semibold text-primary">{code}</span>
              <span className="text-muted-foreground">{meaning}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="health" className="space-y-3">
        <h2 id="health" className="text-lg font-semibold text-foreground">
          Disponibilidade
        </h2>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-subtle">
          <span className="text-sm text-muted-foreground">GET /health:</span>
          <ApiStatusBadge />
        </div>
      </section>

      <section aria-labelledby="swagger" className="space-y-3">
        <h2 id="swagger" className="text-lg font-semibold text-foreground">
          Documentação interativa
        </h2>
        <Button asChild variant="outline">
          <a href={API_DOCS_URL} target="_blank" rel="noreferrer">
            Abrir Swagger / OpenAPI
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </Button>
        <p className="text-xs text-muted-foreground">
          Disponível apenas quando a aplicação FastAPI estiver em execução.
        </p>
      </section>
    </div>
  );
}
