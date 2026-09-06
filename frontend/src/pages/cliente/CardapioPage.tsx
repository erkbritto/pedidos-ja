import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { CatalogoProdutos } from "@/components/catalogo/CatalogoProdutos";
import { Button } from "@/components/ui/button";
import { filtrarProdutos } from "@/data/produtos";

/** Home pública — cardápio visual com busca local (nunca chama a API). */
export function CardapioPage() {
  useEffect(() => {
    document.title = "Pedidos já — Cardápio";
  }, []);

  const [busca, setBusca] = useState("");
  const produtos = useMemo(() => filtrarProdutos(busca), [busca]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-4 sm:px-6">
        <h1 className="sr-only">Cardápio</h1>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos no cardápio"
            className="h-12 w-full rounded-xl border border-border bg-card pl-9 pr-10 text-base text-foreground shadow-card placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {busca.length > 0 ? (
            <button
              type="button"
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
              className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-5">
          {produtos.length > 0 ? (
            <CatalogoProdutos produtos={produtos} />
          ) : (
            <div
              role="status"
              className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center"
            >
              <p className="text-base font-semibold text-foreground">Nenhum produto encontrado.</p>
              <p className="mt-1 text-sm text-muted-foreground">Tente outro termo de busca.</p>
              <Button type="button" variant="outline" className="mt-5" onClick={() => setBusca("")}>
                Limpar busca
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
