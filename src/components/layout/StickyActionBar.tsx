import type { ReactNode } from "react";

/**
 * Barra de ação fixa na base da tela (mobile-first), respeitando a
 * safe-area do dispositivo. O espaçador correspondente é responsabilidade
 * da página, para que o conteúdo nunca fique escondido atrás da barra.
 */
export function StickyActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="mx-auto w-full max-w-5xl px-4 py-3 sm:px-6">{children}</div>
    </div>
  );
}

/** Espaço reservado para a barra fixa não cobrir o final do conteúdo. */
export function StickyActionSpacer() {
  return <div aria-hidden="true" className="h-28" />;
}
