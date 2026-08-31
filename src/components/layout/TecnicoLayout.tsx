import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Brand } from "./Brand";
import { DemoBadge } from "./DemoBadge";
import { SiteFooter } from "./SiteFooter";

/** Layout das páginas técnicas do projeto (API & Documentação, Arquitetura). */
export function TecnicoShell({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
          <Brand subtitle="Documentação do projeto" />
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <DemoBadge className="hidden md:inline-flex" />
            {/* Alternância entre páginas técnicas: oculta em telas muito estreitas
                para evitar overflow do header — cada página também se acessa
                pelo rodapé e pela navegação administrativa. */}
            <nav aria-label="Páginas técnicas" className="hidden items-center gap-1 sm:flex">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(location.pathname === "/api" && "bg-muted")}
              >
                <Link to="/api" aria-current={location.pathname === "/api" ? "page" : undefined}>
                  API
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(location.pathname === "/arquitetura" && "bg-muted")}
              >
                <Link
                  to="/arquitetura"
                  aria-current={location.pathname === "/arquitetura" ? "page" : undefined}
                >
                  Arquitetura
                </Link>
              </Button>
            </nav>
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft aria-hidden="true" className="size-4" />
                Início
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>

      <SiteFooter />
    </div>
  );
}
