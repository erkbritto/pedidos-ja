import { USE_MOCKS } from "@/lib/env";
import { cn } from "@/lib/utils";

/**
 * Indicador discreto do modo de demonstração.
 * Os dados vivem apenas em memória enquanto a página estiver aberta —
 * isto não é persistência.
 */
export function DemoBadge({ className }: { className?: string }) {
  if (!USE_MOCKS) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-warning/30 bg-primary-soft px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-warning",
        className,
      )}
    >
      Modo de demonstração
    </span>
  );
}
