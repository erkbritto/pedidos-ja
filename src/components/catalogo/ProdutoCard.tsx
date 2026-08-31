import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/format";
import type { ProdutoVisual } from "@/data/produtos";

/**
 * Card do cardápio: imagem, nome, preço e CTA "Escolher".
 * O CTA é um link explícito (não o card inteiro), o que mantém título e
 * preço fora de um elemento interativo e deixa a ação clara no leitor de
 * tela.
 */
export function ProdutoCard({ produto }: { produto: ProdutoVisual }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <img
        src={produto.imagem}
        alt={produto.nome}
        loading="lazy"
        width={240}
        height={180}
        className="aspect-[4/3] w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-semibold leading-snug text-foreground sm:text-base">
          {produto.nome}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
          {produto.descricao}
        </p>
        <p className="mt-2 text-base font-bold tabular text-foreground sm:text-lg">
          {formatCurrency(produto.valorUnitario)}
        </p>

        <Link
          to={`/produto/${produto.id}`}
          className="mt-3 flex h-11 items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.97] active:bg-primary-hover"
        >
          Escolher
          <span className="sr-only"> {produto.nome}</span>
        </Link>
      </div>
    </article>
  );
}
