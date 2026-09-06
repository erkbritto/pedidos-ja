import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Loader2, Check, ReceiptText, Home } from "lucide-react";
import { PublicPageHeader } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/StateBlocks";
import { usePedido } from "@/hooks/usePedidos";
import { isApiError, getErrorMessage } from "@/types/api";
import { formatCurrency, formatInteger } from "@/lib/format";
import { PedidoStatusBadge } from "@/components/pedidos/PedidoStatusBadge";
import { parsePedidoId } from "@/lib/pedido-id";

/** Página pública de detalhes de um pedido — acessível por /pedido/:id */
export function PedidoPublicoPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const foiCriado = searchParams.get("criado") === "1";

  const pedidoId = parsePedidoId(id);
  const { data: pedido, isLoading, isError, error } = usePedido(pedidoId ?? -1);

  useEffect(() => {
    if (foiCriado) {
      document.title = "Pedido realizado — Pedidos já";
    } else if (pedido) {
      document.title = `Pedido #${pedido.id} — Pedidos já`;
    } else {
      document.title = "Pedido — Pedidos já";
    }
  }, [foiCriado, pedido]);

  // ID inválido
  if (pedidoId === null) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PublicPageHeader title="Pedido" backTo="/" />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <EmptyState
            title="Número de pedido inválido"
            description="Use somente números maiores que zero."
            action={
              <Button asChild>
                <Link to="/acompanhar">Tentar novamente</Link>
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PublicPageHeader title="Pedido" backTo="/" />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 aria-hidden="true" className="size-5 animate-spin" />
            <p>Carregando pedido...</p>
          </div>
        </main>
      </div>
    );
  }

  // Erro na requisição
  if (isError) {
    const isNotFound = isApiError(error) && error.isNotFound;
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PublicPageHeader title="Pedido" backTo="/" />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <EmptyState
            title={isNotFound ? "Pedido não encontrado" : "Erro ao carregar pedido"}
            description={
              isNotFound
                ? "Verifique o número e tente novamente."
                : getErrorMessage(error, "Serviço temporariamente indisponível.")
            }
            action={
              <Button asChild>
                <Link to="/acompanhar">Consultar outro pedido</Link>
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  // Pedido não encontrado após loading
  if (!pedido) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PublicPageHeader title="Pedido" backTo="/" />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <EmptyState
            title="Pedido não encontrado"
            description="Verifique o número e tente novamente."
            action={
              <Button asChild>
                <Link to="/acompanhar">Consultar outro pedido</Link>
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  // Estado de sucesso (apenas quando ?criado=1)
  if (foiCriado) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PublicPageHeader title="Pedido" backTo="/" />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <div
            role="status"
            className="rounded-xl border border-success/30 bg-success-soft p-6 shadow-card"
          >
            <div className="flex justify-center">
              <span
                className="flex size-16 items-center justify-center rounded-full bg-card text-success"
                style={{ color: "#28A745" }}
              >
                <Check aria-hidden="true" className="size-8" />
              </span>
            </div>

            <div className="mt-6 text-center">
              <h1 className="text-xl font-semibold text-foreground">Pedido realizado</h1>
              <p className="text-xl font-semibold text-foreground">com sucesso!</p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Seu número é
              </p>
              <p className="text-5xl font-bold tabular text-foreground">#{pedido.id}</p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-semibold text-foreground">{pedido.status}</span>
              </p>
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Guarde este número para acompanhar seu pedido.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild className="h-12 w-full text-base">
                <Link to={`/pedido/${pedido.id}`}>
                  <ReceiptText aria-hidden="true" className="size-4" />
                  Acompanhar este pedido
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 w-full text-base">
                <Link to="/">
                  <Home aria-hidden="true" className="size-4" />
                  Voltar para a Home
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Visualização normal do pedido
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicPageHeader title="Pedido" backTo="/" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h1 className="text-xl font-semibold text-foreground">Pedido #{pedido.id}</h1>
            <PedidoStatusBadge status={pedido.status} />
          </div>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Cliente</dt>
              <dd className="text-sm font-medium text-foreground">{pedido.cliente}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Produto</dt>
              <dd className="text-sm font-medium text-foreground">{pedido.produto}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Quantidade</dt>
              <dd className="text-sm tabular text-foreground">
                {formatInteger(pedido.quantidade)}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Valor unitário</dt>
              <dd className="text-sm tabular text-foreground">
                {formatCurrency(pedido.valor_unitario)}
              </dd>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <dt className="text-base font-semibold text-foreground">Total</dt>
              <dd className="text-base font-bold tabular text-foreground">
                {formatCurrency(pedido.valor_total)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant="outline" className="h-12 w-full text-base">
              <Link to="/acompanhar">Consultar outro pedido</Link>
            </Button>
            <Button asChild className="h-12 w-full text-base">
              <Link to="/">Voltar para o cardápio</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
