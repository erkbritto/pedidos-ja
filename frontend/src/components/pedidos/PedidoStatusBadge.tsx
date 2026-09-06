import { CircleCheck, CircleDot, CircleSlash } from "lucide-react";
import type { PedidoStatus } from "@/types/pedido";
import { cn } from "@/lib/utils";

const config: Record<PedidoStatus, { className: string; Icon: typeof CircleDot }> = {
  CRIADO: { className: "bg-info-soft text-info border-info/25", Icon: CircleDot },
  CONFIRMADO: { className: "bg-success-soft text-success border-success/25", Icon: CircleCheck },
  CANCELADO: {
    className: "bg-danger-soft text-destructive border-destructive/25",
    Icon: CircleSlash,
  },
};

export function PedidoStatusBadge({
  status,
  className,
}: {
  status: PedidoStatus;
  className?: string;
}) {
  const { className: tone, Icon } = config[status] || {
    className: "bg-muted text-muted-foreground border-border",
    Icon: CircleDot,
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        tone,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {status}
    </span>
  );
}
