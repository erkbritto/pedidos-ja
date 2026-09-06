import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/StateBlocks";
import { PedidoTable } from "@/components/pedidos/PedidoTable";
import { PedidoMobileCard } from "@/components/pedidos/PedidoMobileCard";
import {
  PedidoFilters,
  type SortOption,
  type StatusFilter,
} from "@/components/pedidos/PedidoFilters";
import { Button } from "@/components/ui/button";
import { usePedidos } from "@/hooks/usePedidos";
import { getErrorMessage } from "@/types/api";
import type { Pedido } from "@/types/pedido";

function matchesSearch(pedido: Pedido, term: string): boolean {
  if (!term) return true;
  const needle = term.trim().toLowerCase();
  if (needle.length === 0) return true;
  return (
    String(pedido.id).includes(needle) ||
    pedido.cliente.toLowerCase().includes(needle) ||
    pedido.produto.toLowerCase().includes(needle)
  );
}

function sortPedidos(pedidos: Pedido[], sort: SortOption): Pedido[] {
  const sorted = [...pedidos];
  switch (sort) {
    case "recentes":
      return sorted.sort(
        (a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime(),
      );
    case "antigos":
      return sorted.sort(
        (a, b) => new Date(a.data_criacao).getTime() - new Date(b.data_criacao).getTime(),
      );
    case "id_asc":
      return sorted.sort((a, b) => a.id - b.id);
    case "id_desc":
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
}

export function AdminPedidosPage() {
  useEffect(() => {
    document.title = "Pedidos — Pedido Já";
  }, []);

  const { data: pedidos, isPending, isError, error, refetch, isFetching } = usePedidos();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("TODOS");
  const [sort, setSort] = useState<SortOption>("recentes");

  const filtrados = useMemo(() => {
    if (!pedidos) return [];
    const porStatus =
      status === "TODOS" ? [...pedidos] : pedidos.filter((p) => p.status === status);
    const porBusca = porStatus.filter((p) => matchesSearch(p, search));
    return sortPedidos(porBusca, sort);
  }, [pedidos, search, status, sort]);

  const filtrosAtivos = search.trim().length > 0 || status !== "TODOS";

  function limparFiltros() {
    setSearch("");
    setStatus("TODOS");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Pedidos" description="Todos os pedidos registrados na aplicação." />

      <PedidoFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      {isError ? (
        <ErrorState
          message={getErrorMessage(error, "Não foi possível carregar os pedidos.")}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : isPending ? (
        <LoadingState rows={5} label="Carregando pedidos..." />
      ) : (pedidos?.length ?? 0) === 0 ? (
        <EmptyState
          title="Nenhum pedido cadastrado."
          description="Assim que um pedido for registrado pela área do cliente, ele aparecerá aqui."
        />
      ) : filtrados.length === 0 ? (
        <EmptyState
          title="Nenhum pedido corresponde aos filtros atuais."
          action={
            <Button type="button" variant="outline" size="sm" onClick={limparFiltros}>
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {filtrados.length}{" "}
            {filtrados.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
            {filtrosAtivos ? " com os filtros atuais" : ""}.
          </p>
          <PedidoTable pedidos={filtrados} />
          <div className="space-y-3 md:hidden">
            {filtrados.map((pedido) => (
              <PedidoMobileCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
