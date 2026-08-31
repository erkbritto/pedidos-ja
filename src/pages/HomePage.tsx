import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Loader2, Search } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CatalogoProdutos } from "@/components/catalogo/CatalogoProdutos";
import { QuantidadeStepper } from "@/components/catalogo/QuantidadeStepper";
import { LoadingState, ErrorState } from "@/components/common/StateBlocks";
import { PedidoDetalhes } from "@/components/pedidos/PedidoDetalhes";
import { PedidoStatusBadge } from "@/components/pedidos/PedidoStatusBadge";
import { PedidoNaoEncontrado, PedidoIdInvalido } from "@/components/pedidos/PedidoNaoEncontrado";
import { pedidoFormSchema, type PedidoFormValues } from "@/schemas/pedido";
import { useCreatePedido, usePedido } from "@/hooks/usePedidos";
import { isApiError, getErrorMessage } from "@/types/api";
import { formatCurrency, formatInteger } from "@/lib/format";
import { parsePedidoId } from "@/lib/pedido-id";
import { type ProdutoVisual } from "@/data/produtos";

const defaultValues: PedidoFormValues = {
  cliente: "",
  produto: "",
  quantidade: 1,
  valor_unitario: 0,
};

/** Rola até um elemento respeitando `prefers-reduced-motion`. */
function scrollToElement(element: HTMLElement | null) {
  if (!element) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export function HomePage() {
  useEffect(() => {
    document.title = "Pedido Já — Peça de forma simples e rápida";
  }, []);

  const [selectedProdutoId, setSelectedProdutoId] = useState<string | null>(null);
  const [consultaInput, setConsultaInput] = useState("");
  // `null` = consulta ainda não tentada nesta sessão. String vazia = tentativa com campo vazio.
  const [consultaSubmitted, setConsultaSubmitted] = useState<string | null>(null);

  const pedidoSectionRef = useRef<HTMLDivElement>(null);
  const numeroPedidoInputRef = useRef<HTMLInputElement>(null);

  const createPedido = useCreatePedido();

  const form = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const quantidade = form.watch("quantidade");
  const valorUnitario = form.watch("valor_unitario");
  const produtoNome = form.watch("produto");
  const clienteNome = form.watch("cliente");
  const totalEstimado = (Number(quantidade) || 0) * (Number(valorUnitario) || 0);

  const podeEnviar =
    Boolean(selectedProdutoId) && clienteNome.trim().length > 0 && Number(quantidade) >= 1;

  // Rola suavemente até a confirmação assim que o pedido é criado, sem trocar de rota.
  useEffect(() => {
    if (createPedido.isSuccess) {
      scrollToElement(pedidoSectionRef.current);
    }
  }, [createPedido.isSuccess]);

  function handleSelectProduto(produto: ProdutoVisual) {
    setSelectedProdutoId(produto.id);
    form.setValue("produto", produto.nome, { shouldValidate: true });
    form.setValue("valor_unitario", produto.valorUnitario, { shouldValidate: true });
  }

  function handleQuantidadeChange(value: number) {
    form.setValue("quantidade", value, { shouldValidate: true });
  }

  function onSubmit(values: PedidoFormValues) {
    createPedido.mutate(values, {
      onError: (error) => {
        toast.error(getErrorMessage(error, "Não foi possível criar o pedido."));
      },
    });
  }

  function fazerOutroPedido() {
    createPedido.reset();
    form.reset(defaultValues);
    setSelectedProdutoId(null);
    scrollToElement(document.getElementById("catalogo"));
  }

  function consultarPedidoPorId(id: number) {
    const idStr = String(id);
    setConsultaInput(idStr);
    setConsultaSubmitted(idStr);
    scrollToElement(document.getElementById("consultar-pedido"));
  }

  function handleConsultaSubmit(event: React.FormEvent) {
    event.preventDefault();
    setConsultaSubmitted(consultaInput);
  }

  function tentarNovamenteConsulta() {
    setConsultaSubmitted(null);
    setConsultaInput("");
    numeroPedidoInputRef.current?.focus();
  }

  const consultaTentada = consultaSubmitted !== null;
  const consultaVazia = consultaTentada && consultaSubmitted.trim().length === 0;
  const parsedConsultaId = consultaTentada ? parsePedidoId(consultaSubmitted) : null;
  const consultaIdInvalida = consultaTentada && !consultaVazia && parsedConsultaId === null;
  const consultaQuery = usePedido(parsedConsultaId ?? -1);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero — enxuto, sem ocupar metade da tela no celular */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-2 pt-6 sm:px-6 sm:pt-10 lg:px-8">
          <h1 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Peça de forma simples e rápida
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground sm:text-base">
            Escolha seu produto e faça seu pedido em poucos passos.
          </p>
        </section>

        {/* Etapa 1 — Catálogo */}
        <section id="catalogo" className="mx-auto w-full max-w-6xl px-4 pb-2 pt-6 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-foreground">1. Escolha seu produto</h2>
          <p className="mt-1 text-sm text-muted-foreground">Toque em uma opção para selecionar.</p>
          <div className="mt-4">
            <CatalogoProdutos
              produtoSelecionadoId={selectedProdutoId}
              onSelect={handleSelectProduto}
            />
          </div>
        </section>

        {/* Etapa 2 — Monte seu pedido / confirmação */}
        <section
          ref={pedidoSectionRef}
          className="mx-auto w-full max-w-2xl scroll-mt-16 px-4 py-8 sm:px-6 lg:px-8"
        >
          {createPedido.isSuccess && createPedido.data ? (
            <ConfirmacaoPedido
              pedido={createPedido.data}
              onFazerOutro={fazerOutroPedido}
              onConsultar={consultarPedidoPorId}
            />
          ) : (
            <div className="rounded-xl border border-border bg-card p-4 shadow-subtle sm:p-6">
              <h2 className="text-lg font-semibold text-foreground">2. Monte seu pedido</h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-5" noValidate>
                  {/* Produto selecionado, de forma compacta */}
                  {selectedProdutoId ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary-soft px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {produtoNome}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(valorUnitario)} cada
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollToElement(document.getElementById("catalogo"))}
                        className="shrink-0 text-xs font-medium text-primary underline-offset-2 hover:underline"
                      >
                        Trocar
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Selecione um produto acima para continuar.
                      </p>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="cliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu nome</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex.: Ana Souza"
                            autoComplete="name"
                            className="h-11 text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-1.5">
                    <Label htmlFor="quantidade-pedido">Quantidade</Label>
                    <QuantidadeStepper
                      id="quantidade-pedido"
                      value={quantidade}
                      onChange={handleQuantidadeChange}
                    />
                  </div>

                  {/* Resumo */}
                  <div className="rounded-lg bg-muted px-4 py-3.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Resumo
                    </p>
                    {selectedProdutoId ? (
                      <>
                        <p className="mt-2 text-sm text-foreground">{produtoNome}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatInteger(quantidade || 0)} × {formatCurrency(valorUnitario)}
                        </p>
                        <div className="mt-3 border-t border-border pt-3">
                          <p className="text-xs text-muted-foreground">Total estimado</p>
                          <p className="text-2xl font-semibold tabular text-foreground">
                            {formatCurrency(totalEstimado)}
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          O valor final é confirmado pelo sistema ao criar o pedido.
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Selecione um produto para continuar.
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!podeEnviar || createPedido.isPending}
                    className="h-12 w-full text-base"
                  >
                    {createPedido.isPending ? (
                      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    ) : null}
                    {createPedido.isPending ? "Criando pedido..." : "Fazer pedido"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </section>

        {/* Acompanhar pedido */}
        <section
          id="consultar-pedido"
          className="mx-auto w-full max-w-2xl scroll-mt-16 px-4 py-8 sm:px-6 lg:px-8"
        >
          <h2 className="text-lg font-semibold text-foreground">Acompanhar pedido</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Digite o número recebido após fazer seu pedido.
          </p>

          <form
            onSubmit={handleConsultaSubmit}
            className="mt-4 space-y-3 rounded-xl border border-border bg-card p-4 shadow-subtle sm:p-5"
          >
            <div className="space-y-1.5">
              <Label htmlFor="numero-pedido">Número do pedido</Label>
              <Input
                id="numero-pedido"
                ref={numeroPedidoInputRef}
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder="Ex.: 12"
                className="h-11 text-base"
                value={consultaInput}
                onChange={(event) => setConsultaInput(event.target.value)}
              />
            </div>
            <Button type="submit" className="h-11 w-full sm:w-auto">
              <Search aria-hidden="true" className="size-4" />
              Consultar pedido
            </Button>
          </form>

          <div className="mt-5">
            {!consultaTentada ? null : consultaVazia ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                Informe o número do pedido.
              </p>
            ) : consultaIdInvalida ? (
              <PedidoIdInvalido />
            ) : consultaQuery.isPending ? (
              <LoadingState rows={2} label="Consultando pedido..." />
            ) : consultaQuery.isError ? (
              isApiError(consultaQuery.error) && consultaQuery.error.isNotFound ? (
                <PedidoNaoEncontrado
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={tentarNovamenteConsulta}
                    >
                      Tentar novamente
                    </Button>
                  }
                />
              ) : (
                <ErrorState
                  message={getErrorMessage(
                    consultaQuery.error,
                    "Serviço temporariamente indisponível.",
                  )}
                  onRetry={() => consultaQuery.refetch()}
                  isRetrying={consultaQuery.isFetching}
                />
              )
            ) : consultaQuery.data ? (
              <PedidoDetalhes pedido={consultaQuery.data} />
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function ConfirmacaoPedido({
  pedido,
  onFazerOutro,
  onConsultar,
}: {
  pedido: NonNullable<ReturnType<typeof useCreatePedido>["data"]>;
  onFazerOutro: () => void;
  onConsultar: (id: number) => void;
}) {
  return (
    <div
      role="status"
      className="rounded-xl border border-success/30 bg-success-soft p-4 shadow-subtle sm:p-6"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-success">
          <Check aria-hidden="true" className="size-5" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">Pedido realizado!</h2>
      </div>

      <div className="mt-5 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Seu número é
        </p>
        <p className="text-5xl font-bold tabular text-foreground">#{pedido.id}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Guarde este número para acompanhar seu pedido.
        </p>
      </div>

      <dl className="mt-6 space-y-2.5 border-t border-success/20 pt-5">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-muted-foreground">Produto</dt>
          <dd className="text-sm font-medium text-foreground">{pedido.produto}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-muted-foreground">Quantidade</dt>
          <dd className="text-sm tabular text-foreground">{formatInteger(pedido.quantidade)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-muted-foreground">Total</dt>
          <dd className="text-sm font-semibold tabular text-foreground">
            {formatCurrency(pedido.valor_total)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-muted-foreground">Status</dt>
          <dd>
            <PedidoStatusBadge status={pedido.status} />
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-2">
        <Button type="button" className="h-11 w-full" onClick={() => onConsultar(pedido.id)}>
          <Search aria-hidden="true" className="size-4" />
          Acompanhar este pedido
        </Button>
        <Button type="button" variant="outline" className="h-11 w-full" onClick={onFazerOutro}>
          Fazer outro pedido
        </Button>
      </div>
    </div>
  );
}
