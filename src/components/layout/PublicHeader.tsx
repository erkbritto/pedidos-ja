import { Link } from "react-router-dom";
import { Brand } from "@/components/layout/Brand";
import { DemoBadge } from "@/components/layout/DemoBadge";
import { Button } from "@/components/ui/button";

/**
 * Header da experiência pública. Apenas duas ações (marca + Admin), então
 * não há necessidade de menu hambúrguer — ele só esconderia a única outra
 * ação disponível. "Acompanhar pedido" aparece como link discreto a partir
 * de telas pequenas/médias, quando já há espaço confortável.
 */
export function PublicHeader() {
  function irParaConsulta() {
    document
      .getElementById("consultar-pedido")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Brand />
        <DemoBadge className="shrink-0" />

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={irParaConsulta}
            className="hidden rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline sm:inline-block"
          >
            Acompanhar pedido
          </button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
