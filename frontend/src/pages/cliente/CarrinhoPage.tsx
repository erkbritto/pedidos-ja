import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { PublicPageHeader } from "@/components/layout/PublicHeader";
import { StickyActionBar, StickyActionSpacer } from "@/components/layout/StickyActionBar";
import { QuantidadeStepper } from "@/components/catalogo/QuantidadeStepper";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/StateBlocks";
import { useCarrinho } from "@/context/CarrinhoContext";
import { findProdutoVisual } from "@/data/produtos";
import { formatCurrency, formatInteger } from "@/lib/format";

/**
 * Carrinho — rascunho de UM pedido (um produto + uma quantidade).
 * Não há frete, taxa de entrega nem pagamento: nada disso existe no contrato.
 */
export function CarrinhoPage() {
  const navigate = useNavigate();
  const { draft, definirQuantidade, limpar, subtotal } = useCarrinho();
  const produto = findProdutoVisual(draft?.produtoId);

  useEffect(() => {
    document.title = "Carrinho — Pedidos já";
  }, []);

  if (!draft) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PublicPageHeader title="Carrinho" backTo="/" />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <EmptyState
            title="Seu carrinho está vazio."
            description="Escolha um produto do cardápio para começar seu pedido."
            action={
              <Button asChild>
                <Link to="/">Escolher produto</Link>
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicPageHeader title="Carrinho" backTo="/" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 sm:px-6">
        <section
          aria-label="Item do pedido"
          className="rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <div className="flex gap-3">
            {produto ? (
              <img
                src={produto.imagem}
                alt={produto.nome}
                width={240}
                height={180}
                className="size-20 shrink-0 rounded-[10px] border border-border object-cover"
              />
            ) : null}

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold leading-snug text-foreground">
                {draft.produto}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatInteger(draft.quantidade)}x · {formatCurrency(draft.valorUnitario)} / un
              </p>
              <p className="mt-1 text-base font-bold tabular text-foreground">
                {formatCurrency(subtotal)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <QuantidadeStepper value={draft.quantidade} onChange={definirQuantidade} />
            <Button asChild variant="outline" className="h-11">
              <Link to="/">Trocar produto</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 text-destructive hover:text-destructive"
              onClick={limpar}
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Remover
            </Button>
          </div>
        </section>

        <section
          aria-label="Resumo do pedido"
          className="mt-4 rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Resumo do pedido
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular text-foreground">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 text-base font-bold">
              <dt className="text-foreground">TOTAL</dt>
              <dd className="tabular text-foreground">{formatCurrency(subtotal)}</dd>
            </div>
          </dl>
        </section>

        <StickyActionSpacer />
      </main>

      <StickyActionBar>
        <button
          type="button"
          onClick={() => navigate("/revisar")}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98] active:bg-primary-hover"
        >
          Revisar pedido
        </button>
      </StickyActionBar>
    </div>
  );
}
