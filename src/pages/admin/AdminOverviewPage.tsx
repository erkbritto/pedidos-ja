import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, CircleDot, CircleSlash, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/StateBlocks";
import { PedidoTable } from "@/components/pedidos/PedidoTable";
import { PedidoMobileCard } from "@/components/pedidos/PedidoMobileCard";
import { usePedidos } from "@/hooks/usePedidos";
import { getErrorMessage } from "@/types/api";

const RECENTES_LIMIT = 5;

export function AdminOverviewPage() {
  useEffect(() => {
    document.title = "Visão Geral — Pedido Já";
  }, []);

  const { data: pedidos, isPending, isError, error, refetch, isFetching } = usePedidos();

  const contagem = useMemo(() => {
    const base = { total: 0, CRIADO: 0, CONFIRMADO: 0, CANCELADO: 0 };
    if (!pedidos) return base;
    for (const pedido of pedidos) {
      base.total += 1;
      base[pedido.status] += 1;
    }
    return base;
  }, [pedidos]);

  const recentes = useMemo(() => {
    if (!pedidos) return [];
    return [...pedidos]
      .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
      .slice(0, RECENTES_LIMIT);
  }, [pedidos]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Visão Geral"
        description="Panorama dos pedidos registrados na aplicação."
        actions={
          <Button asChild variant="outline">
            <Link to="/admin/pedidos">
              Ver todos os pedidos
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        }
      />

      {isError ? (
        <ErrorState
          message={getErrorMessage(error, "Não foi possível carregar os pedidos.")}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : (
        <>
          <section
            aria-label="Indicadores de pedidos"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <StatCard
              key="pedidos"
              label="Pedidos"
              value={String(contagem.total)}
              icon={ListOrdered}
              tone="primary"
              isLoading={isPending}
            />
            <StatCard
              key="criados"
              label="Criados"
              value={String(contagem.CRIADO)}
              icon={CircleDot}
              tone="info"
              isLoading={isPending}
            />
            <StatCard
              key="confirmados"
              label="Confirmados"
              value={String(contagem.CONFIRMADO)}
              icon={CircleCheck}
              tone="success"
              isLoading={isPending}
            />
            <StatCard
              key="cancelados"
              label="Cancelados"
              value={String(contagem.CANCELADO)}
              icon={CircleSlash}
              tone="danger"
              isLoading={isPending}
            />
          </section>

          <section aria-labelledby="recentes-heading" className="space-y-4">
            <h2 id="recentes-heading" className="text-lg font-semibold text-foreground">
              Pedidos recentes
            </h2>

            {isPending ? (
              <LoadingState rows={3} label="Carregando pedidos recentes..." />
            ) : recentes.length === 0 ? (
              <EmptyState
                title="Nenhum pedido cadastrado."
                description="Assim que um pedido for registrado pela área do cliente, ele aparecerá aqui."
              />
            ) : (
              <div className="space-y-3">
                <PedidoTable key="recentes-table" pedidos={recentes} />
                <div className="space-y-3 md:hidden">
                  {recentes.map((pedido) => (
                    <PedidoMobileCard key={pedido.id} pedido={pedido} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
