import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";

export function NotFoundPage() {
  useEffect(() => {
    document.title = "Página não encontrada — Pedido Já";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <CompassIcon aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          Página não encontrada
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço acessado não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
