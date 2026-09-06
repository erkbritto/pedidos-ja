import { Link } from "react-router-dom";
import { formatCurrency, formatDateTime, formatInteger } from "@/lib/format";
import { PedidoStatusBadge } from "./PedidoStatusBadge";
import type { Pedido } from "@/types/pedido";

export function PedidoTable({ pedidos }: { pedidos: Pedido[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border bg-card shadow-subtle md:block">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Lista de pedidos</caption>
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              ID
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Cliente
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Produto
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Qtd.
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Valor unitário
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Valor total
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Data de criação
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="border-t border-border hover:bg-muted/40">
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{pedido.id}</td>
              <td className="px-4 py-3 font-medium text-foreground">{pedido.cliente}</td>
              <td className="px-4 py-3 text-muted-foreground">{pedido.produto}</td>
              <td className="px-4 py-3 text-right tabular">{formatInteger(pedido.quantidade)}</td>
              <td className="px-4 py-3 text-right tabular whitespace-nowrap">
                {formatCurrency(pedido.valor_unitario)}
              </td>
              <td className="px-4 py-3 text-right font-semibold tabular whitespace-nowrap">
                {formatCurrency(pedido.valor_total)}
              </td>
              <td className="px-4 py-3">
                <PedidoStatusBadge status={pedido.status} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatDateTime(pedido.data_criacao)}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/admin/pedidos/${pedido.id}`}
                  className="rounded text-sm font-medium text-primary underline-offset-2 hover:underline"
                >
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
