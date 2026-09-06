import type { ProdutoVisual } from "@/data/produtos";
import { ProdutoCard } from "./ProdutoCard";

/**
 * Grade do cardápio — sempre a lista estática de `src/data/produtos.ts`
 * (eventualmente filtrada pela busca local). Nenhuma chamada à API.
 */
export function CatalogoProdutos({ produtos }: { produtos: readonly ProdutoVisual[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {produtos.map((produto) => (
        <ProdutoCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
