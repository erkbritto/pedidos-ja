import { Link } from "react-router-dom";
import { Package } from "lucide-react";

export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5 rounded-md">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Package aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-base font-semibold leading-tight text-foreground">
          Pedido Já
        </span>
        {subtitle ? (
          <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
        ) : null}
      </span>
      <span className="sr-only">Ir para o início</span>
    </Link>
  );
}
