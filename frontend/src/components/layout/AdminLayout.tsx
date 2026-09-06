import { useState, type ReactNode } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, ListOrdered, Menu, Network, Server } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Brand } from "./Brand";
import { DemoBadge } from "./DemoBadge";
import { SiteFooter } from "./SiteFooter";

const gestao = [
  { label: "Visão Geral", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Pedidos", to: "/admin/pedidos", icon: ListOrdered, end: false },
] as const;

const projeto = [
  { label: "API & Documentação", to: "/admin/api", icon: Server, end: false },
  { label: "Arquitetura", to: "/admin/arquitetura", icon: Network, end: false },
] as const;

type NavGroup = typeof gestao | typeof projeto;

function NavSection({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavGroup;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <nav aria-label={title} className="flex flex-col gap-1">
        {items.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="space-y-6">
      <NavSection title="Gestão" items={gestao} onNavigate={onNavigate} />
      <div className="border-t border-border pt-4">
        <NavSection title="Projeto" items={projeto} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <Brand subtitle="Área Administrativa" />
        <div className="mt-7 flex-1 overflow-y-auto">
          <Sidebar />
        </div>
        <div className="space-y-2 border-t border-border pt-4">
          <DemoBadge />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Desenvolvimento de Sistemas Distribuídos
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Abrir menu de navegação"
              >
                <Menu aria-hidden="true" className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-5">
              <SheetTitle className="sr-only">Navegação administrativa</SheetTitle>
              <Brand subtitle="Área Administrativa" />
              <div className="mt-7 space-y-6">
                <Sidebar onNavigate={() => setOpen(false)} />
                <DemoBadge />
              </div>
            </SheetContent>
          </Sheet>

          <div className="lg:hidden">
            <Brand subtitle="Área Administrativa" />
          </div>

          <div className="ml-auto">
            <Button asChild variant="outline" size="sm">
              <Link to="/">Voltar ao aplicativo</Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
