import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Node {
  label: string;
  detail?: string;
  tone?: "primary" | "app" | "db" | "client";
}

const toneClasses: Record<NonNullable<Node["tone"]>, string> = {
  client: "border-border bg-card text-foreground",
  primary: "border-primary/30 bg-primary-soft text-foreground",
  app: "border-border bg-muted text-foreground",
  db: "border-info/30 bg-info-soft text-foreground",
};

export function ArchitectureDiagram({ nodes, className }: { nodes: Node[]; className?: string }) {
  return (
    <div className={cn("mx-auto flex w-full max-w-sm flex-col items-stretch", className)}>
      {nodes.map((node, index) => (
        <div key={node.label} className="flex flex-col items-center">
          <div
            className={cn(
              "w-full rounded-lg border px-4 py-3 text-center",
              toneClasses[node.tone ?? "app"],
            )}
          >
            <p className="text-sm font-semibold">{node.label}</p>
            {node.detail ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{node.detail}</p>
            ) : null}
          </div>
          {index < nodes.length - 1 ? (
            <ArrowDown aria-hidden="true" className="my-1.5 size-4 text-muted-foreground" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
