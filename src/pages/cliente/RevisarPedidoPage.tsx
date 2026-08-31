import { useEffect, useId, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PublicPageHeader } from "@/components/layout/PublicHeader";
import { StickyActionBar, StickyActionSpacer } from "@/components/layout/StickyActionBar";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useCreatePedido } from "@/hooks/usePedidos";
import { getErrorMessage } from "@/types/api";
import { formatCurrency, formatInteger } from "@/lib/format";

/**
 * Revisão do pedido — única tela que dispara `POST /pedidos`.
 * O payload contém exatamente `cliente`, `produto`, `quantidade` e
 * `valor_unitario`: nada de id, status, valor_total ou data_criacao.
 */
export function RevisarPedidoPage() {
  const navigate = useNavigate();
  const { draft, subtotal, limpar } = useCarrinho();
  const createPedido = useCreatePedido();

  const [cliente, setCliente] = useState("");
  const [erroNome, setErroNome] = useState<string | null>(null);
  const nomeId = useId();
  const erroId = `${nomeId}-erro`;

  useEffect(() => {
    document.title = "Revisar pedido — Pedidos já";
  }, []);

  if (!draft) {
    return <Navigate to="/carrinho" replace />;
  }

  function enviar(event: React.FormEvent) {
    event.preventDefault();
    if (!draft || createPedido.isPending) return;

    const nome = cliente.trim();
    if (nome.length === 0) {
      setErroNome("Informe seu nome.");
      return;
    }
    setErroNome(null);

    createPedido.mutate(
      {
        cliente: nome,
        produto: draft.produto,
        quantidade: draft.quantidade,
        valor_unitario: draft.valorUnitario,
      },
      {
        onSuccess: (pedido) => {
          limpar();
          navigate(`/pedido/${pedido.id}?criado=1`, { replace: true });
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Não foi possível criar o pedido."));
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicPageHeader title="Revisar pedido" backTo="/carrinho" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 sm:px-6">
        <p className="text-sm text-muted-foreground">Confirme os dados abaixo</p>

        <form onSubmit={enviar} noValidate>
          <section
            aria-label="Item"
            className="mt-3 rounded-xl border border-border bg-card p-4 shadow-card"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Item
            </h2>
            <p className="mt-2 text-base font-semibold text-foreground">{draft.produto}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Quantidade: {formatInteger(draft.quantidade)}
            </p>
            <p className="mt-1 text-base font-bold tabular text-foreground">
              {formatCurrency(subtotal)}
            </p>
          </section>

          <section
            aria-label="Seus dados"
            className="mt-4 rounded-xl border border-border bg-card p-4 shadow-card"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Seus dados
            </h2>
            <label htmlFor={nomeId} className="mt-3 block text-sm font-medium text-foreground">
              Seu nome
            </label>
            <input
              id={nomeId}
              value={cliente}
              onChange={(event) => {
                setCliente(event.target.value);
                if (erroNome) setErroNome(null);
              }}
              autoComplete="name"
              placeholder="Ex.: Ana Souza"
              aria-invalid={erroNome ? true : undefined}
              aria-describedby={erroNome ? erroId : undefined}
              className="mt-1.5 h-12 w-full rounded-[10px] border border-input bg-card px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive"
            />
            {erroNome ? (
              <p id={erroId} role="alert" className="mt-1.5 text-sm text-destructive">
                {erroNome}
              </p>
            ) : null}
          </section>

          <section
            aria-label="Total do pedido"
            className="mt-4 rounded-xl border border-border bg-card p-4 shadow-card"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Total do pedido
            </p>
            <p className="mt-1 text-2xl font-bold tabular text-foreground">
              {formatCurrency(subtotal)}
            </p>
          </section>

          <StickyActionSpacer />

          <StickyActionBar>
            <button
              type="submit"
              disabled={createPedido.isPending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98] active:bg-primary-hover disabled:pointer-events-none disabled:opacity-60"
            >
              {createPedido.isPending ? (
                <>
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  Criando pedido...
                </>
              ) : (
                "Pedir já"
              )}
            </button>
          </StickyActionBar>
        </form>
      </main>
    </div>
  );
}
