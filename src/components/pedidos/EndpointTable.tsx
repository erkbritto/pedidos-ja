import { cn } from "@/lib/utils";

export interface EndpointRow {
  method: "GET" | "POST" | "PATCH";
  endpoint: string;
  objetivo: string;
}

export const endpoints: EndpointRow[] = [
  { method: "GET", endpoint: "/health", objetivo: "Verificar disponibilidade da API" },
  { method: "POST", endpoint: "/pedidos", objetivo: "Criar pedido" },
  { method: "GET", endpoint: "/pedidos", objetivo: "Listar pedidos" },
  { method: "GET", endpoint: "/pedidos/{id}", objetivo: "Consultar pedido" },
  { method: "PATCH", endpoint: "/pedidos/{id}/status", objetivo: "Alterar somente o status" },
];

const methodTone: Record<EndpointRow["method"], string> = {
  GET: "bg-info-soft text-info",
  POST: "bg-success-soft text-success",
  PATCH: "bg-primary-soft text-primary",
};

export function EndpointTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Contrato HTTP da API de pedidos</caption>
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-semibold">
              Método
            </th>
            <th scope="col" className="px-4 py-2.5 font-semibold">
              Endpoint
            </th>
            <th scope="col" className="hidden px-4 py-2.5 font-semibold sm:table-cell">
              Objetivo
            </th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((row) => (
            <tr key={`${row.method}-${row.endpoint}`} className="border-t border-border">
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex rounded px-2 py-0.5 font-mono text-xs font-semibold",
                    methodTone[row.method],
                  )}
                >
                  {row.method}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-foreground sm:text-sm">
                {row.endpoint}
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                {row.objetivo}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
