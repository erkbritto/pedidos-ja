import { Link } from "react-router-dom";

/** Rodapé com links técnicos discretos, presente em todas as áreas. */
export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Projeto acadêmico — Desenvolvimento de Sistemas Distribuídos</span>
        <span className="flex flex-wrap gap-4">
          <Link to="/admin" className="underline-offset-2 hover:underline">
            Área Administrativa
          </Link>
          <Link to="/api" className="underline-offset-2 hover:underline">
            API
          </Link>
          <Link to="/arquitetura" className="underline-offset-2 hover:underline">
            Arquitetura
          </Link>
        </span>
      </div>
    </footer>
  );
}
