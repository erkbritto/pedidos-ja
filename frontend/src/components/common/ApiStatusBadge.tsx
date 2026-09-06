import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { useHealth } from "@/hooks/useHealth";
import { cn } from "@/lib/utils";

export function ApiStatusBadge({ className }: { className?: string }) {
  const { data, isPending, isError } = useHealth();

  const state = isPending
    ? { label: "Verificando API...", Icon: Loader2, tone: "text-muted-foreground bg-muted" }
    : isError || data?.status !== "ok"
      ? { label: "API indisponível", Icon: CircleAlert, tone: "text-destructive bg-danger-soft" }
      : { label: "API operacional", Icon: CircleCheck, tone: "text-success bg-success-soft" };

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        state.tone,
        className,
      )}
    >
      <state.Icon aria-hidden="true" className={cn("size-3.5", isPending && "animate-spin")} />
      {state.label}
    </span>
  );
}
