import { formatCurrency, formatDateTime, formatInteger } from "@/lib/format";
import { PedidoStatusBadge } from "./PedidoStatusBadge";
import type { Pedido } from "@/types/pedido";

/** Apresentação somente leitura de um pedido, reutilizada pelo cliente e pelo admin. */
export function PedidoDetalhes({ pedido }: { pedido: Pedido }) {
  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-subtle">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted-foreground">Pedido #{pedido.id}</p>
          <h2 className="truncate text-lg font-semibold text-foreground">{pedido.cliente}</h2>
        </div>
        <PedidoStatusBadge status={pedido.status} />
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div key="produto">
          <dt className="text-xs text-muted-foreground">Produto</dt>
          <dd className="text-sm font-medium text-foreground">{pedido.produto}</dd>
        </div>
        <div key="quantidade">
          <dt className="text-xs text-muted-foreground">Quantidade</dt>
          <dd className="text-sm tabular">{formatInteger(pedido.quantidade)}</dd>
        </div>
        <div key="total">
          <dt className="text-xs text-muted-foreground">Total</dt>
          <dd className="text-sm font-semibold tabular">{formatCurrency(pedido.valor_total)}</dd>
        </div>
        <div key="valor-unitario">
          <dt className="text-xs text-muted-foreground">Valor unitário</dt>
          <dd className="text-sm tabular">{formatCurrency(pedido.valor_unitario)}</dd>
        </div>
        <div key="feito-em">
          <dt className="text-xs text-muted-foreground">Feito em</dt>
          <dd className="text-sm text-muted-foreground">{formatDateTime(pedido.data_criacao)}</dd>
        </div>
      </dl>
    </section>
  );
}
