import { Link } from "react-router-dom";
import { formatCurrency, formatDateTime, formatInteger } from "@/lib/format";
import { PedidoStatusBadge } from "./PedidoStatusBadge";
import type { Pedido } from "@/types/pedido";

export function PedidoMobileCard({ pedido }: { pedido: Pedido }) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-subtle">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted-foreground">#{pedido.id}</p>
          <h3 className="truncate text-sm font-semibold text-foreground">{pedido.cliente}</h3>
          <p className="truncate text-sm text-muted-foreground">{pedido.produto}</p>
        </div>
        <PedidoStatusBadge status={pedido.status} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div key="quantidade">
          <dt className="text-xs text-muted-foreground">Quantidade</dt>
          <dd className="tabular">{formatInteger(pedido.quantidade)}</dd>
        </div>
        <div key="valor-unitario">
          <dt className="text-xs text-muted-foreground">Valor unitário</dt>
          <dd className="tabular">{formatCurrency(pedido.valor_unitario)}</dd>
        </div>
        <div key="valor-total">
          <dt className="text-xs text-muted-foreground">Valor total</dt>
          <dd className="font-semibold tabular">{formatCurrency(pedido.valor_total)}</dd>
        </div>
        <div key="data-criacao">
          <dt className="text-xs text-muted-foreground">Data de criação</dt>
          <dd className="text-muted-foreground">{formatDateTime(pedido.data_criacao)}</dd>
        </div>
      </dl>

      <Link
        to={`/admin/pedidos/${pedido.id}`}
        className="mt-4 inline-flex rounded text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        Ver detalhes
      </Link>
    </article>
  );
}
