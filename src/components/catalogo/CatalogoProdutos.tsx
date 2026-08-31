import { PRODUTOS_VISUAIS, type ProdutoVisual } from "@/data/produtos";
import { ProdutoCard } from "./ProdutoCard";

interface CatalogoProdutosProps {
  produtoSelecionadoId: string | null;
  onSelect: (produto: ProdutoVisual) => void;
}

/**
 * Catálogo visual — sempre a lista estática de `src/data/produtos.ts`.
 * Nenhuma chamada à API: existe apenas para agilizar o preenchimento de
 * `produto`/`valor_unitario` do formulário de pedido.
 */
export function CatalogoProdutos({ produtoSelecionadoId, onSelect }: CatalogoProdutosProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {PRODUTOS_VISUAIS.map((produto) => (
        <ProdutoCard
          key={produto.id}
          produto={produto}
          selecionado={produto.id === produtoSelecionadoId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
