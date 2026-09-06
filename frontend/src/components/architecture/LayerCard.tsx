import type { LucideIcon } from "lucide-react";

interface LayerCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function LayerCard({ title, description, icon: Icon }: LayerCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-subtle">
      <span className="flex size-9 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Icon aria-hidden="true" className="size-4.5" />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}
