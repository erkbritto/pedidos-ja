import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type StatTone = "neutral" | "info" | "success" | "danger" | "primary";

const toneClasses: Record<StatTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-destructive",
  primary: "bg-primary-soft text-primary",
};

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: StatTone;
  isLoading?: boolean;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
  isLoading,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-subtle">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          className={cn("flex size-8 items-center justify-center rounded-md", toneClasses[tone])}
        >
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </div>
      {isLoading ? (
        <Skeleton className="mt-3 h-8 w-20" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular">
          {value}
        </p>
      )}
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
