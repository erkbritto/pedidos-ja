import type { ReactNode } from "react";
import { CircleAlert, Inbox, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({
  rows = 4,
  label = "Carregando dados da API...",
}: {
  rows?: number;
  label?: string;
}) {
  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = "Não foi possível carregar",
  message,
  onRetry,
  isRetrying,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/30 bg-danger-soft p-6 text-center sm:text-left"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <CircleAlert
          aria-hidden="true"
          className="mx-auto size-5 shrink-0 text-destructive sm:mx-0 sm:mt-0.5"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          {onRetry ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onRetry}
              disabled={isRetrying}
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              {isRetrying ? "Tentando..." : "Tentar novamente"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
        {icon ?? <Inbox aria-hidden="true" className="size-5" />}
      </div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
