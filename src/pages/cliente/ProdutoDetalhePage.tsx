import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PublicPageHeader } from "@/components/layout/PublicHeader";
import { StickyActionBar, StickyActionSpacer } from "@/components/layout/StickyActionBar";
import { QuantidadeStepper } from "@/components/catalogo/QuantidadeStepper";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/StateBlocks";
import { useCarrinho } from "@/context/CarrinhoContext";
import { findProdutoVisual } from "@/data/produtos";
import { formatCurrency } from "@/lib/format";

/** Detalhe do produto — define/atualiza o rascunho de pedido. */
export function ProdutoDetalhePage() {
  const { produtoId } = useParams<{ produtoId: string }>();
  const navigate = useNavigate();
  const { draft, definirDraft } = useCarrinho();
  const produto = findProdutoVisual(produtoId);

  const jaNoCarrinho = draft?.produtoId === produto?.id;
  const outroProdutoNoCarrinho = Boolean(draft) && !jaNoCarrinho;

  const [quantidade, setQuantidade] = useState(() =>
    draft && draft.produtoId === produtoId ? draft.quantidade : 1,
  );

  useEffect(() => {
    document.title = produto ? `${produto.nome} — Pedidos já` : "Produto — Pedidos já";
  }, [produto]);

  if (!produto) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PublicPageHeader title="Produto" backTo="/" />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <EmptyState
            title="Produto não encontrado"
            description="Esse item não está mais no cardápio."
            action={
              <Button asChild>
                <Link to="/">Ver cardápio</Link>
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  const total = quantidade * produto.valorUnitario;

  const ctaLabel = outroProdutoNoCarrinho
    ? "Trocar produto do pedido"
    : jaNoCarrinho
      ? "Atualizar pedido"
      : "Adicionar ao carrinho";

  function confirmar() {
    if (!produto) return;
    definirDraft({
      produtoId: produto.id,
      produto: produto.nome,
      quantidade,
      valorUnitario: produto.valorUnitario,
    });
    if (outroProdutoNoCarrinho || jaNoCarrinho) {
      toast.success("Produto atualizado.");
    }
    navigate("/carrinho");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicPageHeader title="Pedidos já" backTo="/" showCart />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-4 sm:px-6">
        <div className="md:flex md:items-start md:gap-8">
          <img
            src={produto.imagem}
            alt={produto.nome}
            width={240}
            height={180}
            className="aspect-[4/3] w-full rounded-xl border border-border object-cover shadow-card md:w-1/2"
          />

          <div className="mt-5 md:mt-0 md:flex-1">
            <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
              {produto.nome}
            </h1>
            <p className="mt-1 text-xl font-bold tabular text-primary sm:text-2xl">
              {formatCurrency(produto.valorUnitario)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{produto.descricao}</p>

            {outroProdutoNoCarrinho ? (
              <p
                role="status"
                className="mt-4 rounded-[10px] border border-primary/30 bg-primary-soft px-3 py-2 text-sm text-foreground"
              >
                Seu pedido já tem <strong>{draft?.produto}</strong>. Confirmar aqui substitui o
                produto do pedido.
              </p>
            ) : null}

            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground">Quantidade</p>
              <div className="mt-2">
                <QuantidadeStepper value={quantidade} onChange={setQuantidade} />
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="mt-0.5 text-xl font-bold tabular text-foreground sm:text-2xl">
                {formatCurrency(total)}
              </p>
            </div>
          </div>
        </div>

        <StickyActionSpacer />
      </main>

      <StickyActionBar>
        <button
          type="button"
          onClick={confirmar}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98] active:bg-primary-hover"
        >
          {ctaLabel}
        </button>
      </StickyActionBar>
    </div>
  );
}
