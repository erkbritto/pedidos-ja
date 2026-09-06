import { useEffect } from "react";
import { Boxes, Database, GitBranch, Layers, Server } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ArchitectureDiagram } from "@/components/architecture/ArchitectureDiagram";
import { LayerCard } from "@/components/architecture/LayerCard";

export function ArquiteturaPage() {
  useEffect(() => {
    document.title = "Arquitetura — Pedido Já";
  }, []);

  return (
    <div className="space-y-12">
      <PageHeader
        title="Arquitetura"
        description="Como a aplicação de Pedidos é organizada, da requisição HTTP até o PostgreSQL."
      />

      <section aria-labelledby="arquitetura-fisica" className="space-y-4">
        <h2 id="arquitetura-fisica" className="text-lg font-semibold text-foreground">
          Arquitetura física
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A aplicação de Pedidos e o PostgreSQL executam como componentes separados.
        </p>
        <ArchitectureDiagram
          nodes={[
            { label: "Cliente / Navegador", detail: "HTTP / JSON", tone: "client" },
            {
              label: "container pedidos",
              detail: "API FastAPI + frontend estático",
              tone: "primary",
            },
            { label: "container postgres", detail: "protocolo PostgreSQL", tone: "db" },
          ]}
        />
      </section>

      <section aria-labelledby="arquitetura-interna" className="space-y-4">
        <h2 id="arquitetura-interna" className="text-lg font-semibold text-foreground">
          Arquitetura interna
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          API, Service e Repository são camadas lógicas da mesma aplicação. Não são containers ou
          microsserviços separados.
        </p>
        <ArchitectureDiagram
          nodes={[
            { label: "API / Controller", tone: "app" },
            { label: "Service", tone: "app" },
            { label: "Repository", tone: "app" },
          ]}
        />
      </section>

      <section aria-labelledby="responsabilidades" className="space-y-4">
        <h2 id="responsabilidades" className="text-lg font-semibold text-foreground">
          Responsabilidades das camadas
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <LayerCard
            title="API"
            description="Recebe requisições HTTP, valida contratos e produz respostas."
            icon={Server}
          />
          <LayerCard
            title="Service"
            description="Concentra a lógica da aplicação, incluindo o cálculo de valor_total e a definição do estado inicial do pedido."
            icon={Layers}
          />
          <LayerCard
            title="Repository"
            description="Encapsula as operações de persistência e o acesso ao PostgreSQL."
            icon={Database}
          />
        </div>
      </section>

      <section aria-labelledby="persistencia" className="space-y-3">
        <h2 id="persistencia" className="text-lg font-semibold text-foreground">
          Persistência
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Os pedidos não ficam na memória do frontend ou da instância da API. O estado permanente
          fica no PostgreSQL.
        </p>
      </section>

      <section aria-labelledby="tecnologia" className="space-y-3">
        <h2 id="tecnologia" className="text-lg font-semibold text-foreground">
          Tecnologia do frontend
        </h2>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground shadow-subtle">
            <Boxes aria-hidden="true" className="size-4 text-primary" />
            React + TypeScript + Vite
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground shadow-subtle">
            <GitBranch aria-hidden="true" className="size-4 text-primary" />
            SPA estática compilada em <code className="font-mono">dist/</code>, servida pela API na{" "}
            raiz (<code className="font-mono">/</code>)
          </span>
        </div>
      </section>
    </div>
  );
}
