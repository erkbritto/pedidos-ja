import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState, ErrorState } from "@/components/common/StateBlocks";
import { PedidoDetalhes } from "@/components/pedidos/PedidoDetalhes";
import { PedidoNaoEncontrado, PedidoIdInvalido } from "@/components/pedidos/PedidoNaoEncontrado";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePedido, useUpdatePedidoStatus } from "@/hooks/usePedidos";
import { parsePedidoId } from "@/lib/pedido-id";
import { isApiError, getErrorMessage } from "@/types/api";
import { PEDIDO_STATUS, type PedidoStatus } from "@/types/pedido";

export function AdminPedidoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const parsedId = parsePedidoId(id);

  useEffect(() => {
    document.title = parsedId ? `Pedido #${parsedId} — Pedido Já` : "Pedido — Pedido Já";
  }, [parsedId]);

  const query = usePedido(parsedId ?? -1);
  const updateStatus = useUpdatePedidoStatus(parsedId ?? -1);

  // Status escolhido no select, mas ainda não salvo — evita disparar o PATCH
  // apenas por trocar a seleção. Reinicia sempre que o pedido carregado mudar.
  const [statusSelecionado, setStatusSelecionado] = useState<PedidoStatus | null>(null);

  useEffect(() => {
    if (query.data) setStatusSelecionado(query.data.status);
  }, [query.data]);

  const voltarButton = (
    <Button asChild variant="outline">
      <Link to="/admin/pedidos">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Voltar para pedidos
      </Link>
    </Button>
  );

  if (parsedId === null) {
    return (
      <div className="space-y-8">
        <PageHeader title="Pedido" actions={voltarButton} />
        <PedidoIdInvalido />
      </div>
    );
  }

  function handleSalvarStatus() {
    if (!statusSelecionado) return;
    updateStatus.mutate(statusSelecionado, {
      onSuccess: (pedido) => {
        toast.success(`Status do pedido #${pedido.id} atualizado para ${pedido.status}.`);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Não foi possível atualizar o status do pedido."));
      },
    });
  }

  const statusInalterado = statusSelecionado === query.data?.status;
  const statusValido = statusSelecionado !== null && PEDIDO_STATUS.includes(statusSelecionado);
  const podeSalvar =
    Boolean(query.data) && statusValido && !statusInalterado && !updateStatus.isPending;

  return (
    <div className="space-y-8">
      <PageHeader title={`Pedido #${parsedId}`} actions={voltarButton} />

      {query.isPending ? (
        <LoadingState rows={2} label="Carregando pedido..." />
      ) : query.isError ? (
        isApiError(query.error) && query.error.isNotFound ? (
          <PedidoNaoEncontrado action={voltarButton} />
        ) : (
          <ErrorState
            message={getErrorMessage(query.error, "Não foi possível carregar o pedido.")}
            onRetry={() => query.refetch()}
            isRetrying={query.isFetching}
          />
        )
      ) : query.data ? (
        <div className="max-w-2xl space-y-6">
          <PedidoDetalhes pedido={query.data} />

          <section className="rounded-lg border border-border bg-card p-6 shadow-subtle">
            <h2 className="text-sm font-semibold text-foreground">Alterar status</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Apenas o status do pedido pode ser alterado por aqui. Os demais dados são definidos no
              momento da criação.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:max-w-xs">
              <div className="space-y-1.5">
                <Label htmlFor="status-pedido">Novo status</Label>
                <Select
                  value={statusSelecionado ?? query.data.status}
                  onValueChange={(value) => setStatusSelecionado(value as PedidoStatus)}
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger id="status-pedido">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PEDIDO_STATUS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" onClick={handleSalvarStatus} disabled={!podeSalvar}>
                {updateStatus.isPending ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : null}
                {updateStatus.isPending ? "Salvando..." : "Salvar status"}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
