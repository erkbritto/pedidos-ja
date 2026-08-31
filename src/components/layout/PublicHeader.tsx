import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ReceiptText, ShoppingBag } from "lucide-react";
import { DemoBadge } from "@/components/layout/DemoBadge";
import { useCarrinho } from "@/context/CarrinhoContext";

/**
 * Cabeçalhos da experiência pública.
 *
 * A área pública é um aplicativo de pedidos: não existe nenhum link,
 * botão ou pista visual para a Área Administrativa, documentação da API
 * ou arquitetura. Também não há ícone de perfil/usuário, porque não
 * existem contas nesta entrega.
 */

function CarrinhoButton() {
  const { itensNoCarrinho } = useCarrinho();

  return (
    <Link
      to="/carrinho"
      aria-label={itensNoCarrinho > 0 ? "Carrinho com 1 produto selecionado" : "Carrinho vazio"}
      className="relative flex size-11 items-center justify-center rounded-full text-foreground transition-transform active:scale-[0.95] hover:bg-muted"
    >
      <ShoppingBag aria-hidden="true" className="size-5" />
      <span
        aria-hidden="true"
        className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold leading-none text-primary-foreground"
      >
        {itensNoCarrinho}
      </span>
    </Link>
  );
}

function BrandMark() {
  return (
    <Link
      to="/"
      className="flex min-w-0 items-center gap-2 rounded-md text-[22px] font-bold leading-none text-primary"
    >
      Pedidos já
      <span className="sr-only">Ir para o cardápio</span>
    </Link>
  );
}

/** Header da Home / cardápio: marca, acompanhar pedido e carrinho. */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-2 px-4 sm:px-6">
        <BrandMark />
        <DemoBadge className="hidden shrink-0 sm:inline-flex" />

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/acompanhar"
            aria-label="Acompanhar pedido"
            className="flex size-11 items-center justify-center rounded-full text-foreground transition-transform active:scale-[0.95] hover:bg-muted"
          >
            <ReceiptText aria-hidden="true" className="size-5" />
          </Link>
          <CarrinhoButton />
        </div>
      </div>
    </header>
  );
}

interface PublicPageHeaderProps {
  title: string;
  /** Rota de retorno; por padrão volta no histórico. */
  backTo?: string;
  showCart?: boolean;
}

/** Header interno das etapas do fluxo: voltar + título. */
export function PublicPageHeader({ title, backTo, showCart = false }: PublicPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-1 px-2 sm:px-4">
        <button
          type="button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          aria-label="Voltar"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-foreground transition-transform active:scale-[0.95] hover:bg-muted"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>

        <h1 className="min-w-0 flex-1 truncate text-center text-base font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h1>

        {showCart ? <CarrinhoButton /> : <span aria-hidden="true" className="size-11 shrink-0" />}
      </div>
    </header>
  );
}
