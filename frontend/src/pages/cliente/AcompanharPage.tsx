import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicPageHeader } from "@/components/layout/PublicHeader";
import { parsePedidoId } from "@/lib/pedido-id";

/** Consulta pública de um pedido pelo número. */
export function AcompanharPage() {
  const navigate = useNavigate();
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const inputId = useId();
  const erroId = `${inputId}-erro`;

  useEffect(() => {
    document.title = "Acompanhar pedido — Pedidos já";
  }, []);

  function consultar(event: React.FormEvent) {
    event.preventDefault();

    if (valor.trim().length === 0) {
      setErro("Informe o número do pedido.");
      return;
    }

    const id = parsePedidoId(valor);
    if (id === null) {
      setErro("Use somente números maiores que zero.");
      return;
    }

    setErro(null);
    navigate(`/pedido/${id}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicPageHeader title="Acompanhar pedido" backTo="/" />

      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-6 sm:px-6">
        <form onSubmit={consultar} noValidate>
          <label htmlFor={inputId} className="block text-base font-semibold text-foreground">
            Digite o número do seu pedido
          </label>
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={valor}
            onChange={(event) => {
              setValor(event.target.value);
              if (erro) setErro(null);
            }}
            placeholder="Ex.: 42"
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? erroId : undefined}
            className="mt-3 h-12 w-full rounded-[10px] border border-input bg-card px-3 text-base tabular text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive"
          />
          {erro ? (
            <p id={erroId} role="alert" className="mt-2 text-sm text-destructive">
              {erro}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98] active:bg-primary-hover"
          >
            Consultar pedido
          </button>
        </form>
      </main>
    </div>
  );
}
