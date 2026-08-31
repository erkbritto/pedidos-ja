import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import type { ProdutoVisual } from "@/data/produtos";

interface ProdutoCardProps {
  produto: ProdutoVisual;
  selecionado: boolean;
  onSelect: (produto: ProdutoVisual) => void;
}

/**
 * Card de produto do catálogo. Estrutura semântica: `<article>` com título,
 * descrição e preço, e um `<button>` explícito para a ação de seleção — não
 * o card inteiro como botão. Isso evita heading/parágrafo dentro de um
 * elemento interativo e deixa claro, por leitor de tela, qual é a ação.
 * O estado selecionado nunca depende só de cor: muda a borda, mostra um
 * ícone de confirmação e troca o texto do botão.
 */
export function ProdutoCard({ produto, selecionado, onSelect }: ProdutoCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border bg-card p-4 shadow-subtle transition-colors",
        selecionado ? "border-primary bg-primary-soft ring-1 ring-primary/30" : "border-border",
      )}
    >
      <div className="flex items-start gap-2">
        {selecionado ? (
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Check className="size-3.5" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug text-foreground">{produto.nome}</h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{produto.descricao}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-base font-semibold tabular text-foreground">
          {formatCurrency(produto.valorUnitario)}
        </span>
        <button
          type="button"
          onClick={() => onSelect(produto)}
          aria-pressed={selecionado}
          className={cn(
            "flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-medium transition-all active:scale-[0.97]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            selecionado
              ? "bg-primary text-primary-foreground"
              : "border border-input bg-background text-foreground",
          )}
        >
          {selecionado ? (
            <>
              <Check aria-hidden="true" className="size-4" />
              Selecionado
            </>
          ) : (
            "Selecionar"
          )}
        </button>
      </div>
    </article>
  );
}
