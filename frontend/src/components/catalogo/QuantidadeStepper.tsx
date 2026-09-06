import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantidadeStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  disabled?: boolean;
  id?: string;
}

/**
 * Controle de quantidade [-] valor [+], sempre inteiro e nunca abaixo de
 * `min`. Botões com pelo menos 44×44px de área de toque — confortáveis para
 * uso com uma mão no celular, sem depender do spinner nativo do navegador.
 */
export function QuantidadeStepper({
  value,
  onChange,
  min = 1,
  disabled = false,
  id,
}: QuantidadeStepperProps) {
  const safeValue = Number.isFinite(value) ? value : min;

  function decrementar() {
    onChange(Math.max(min, safeValue - 1));
  }

  function incrementar() {
    onChange(safeValue + 1);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const parsed = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(parsed)) return;
    onChange(Math.max(min, parsed));
  }

  const stepperButtonClass =
    "flex size-11 shrink-0 items-center justify-center rounded-md text-foreground transition-all active:scale-[0.95] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="inline-flex items-center rounded-md border border-input bg-transparent">
      <button
        type="button"
        onClick={decrementar}
        disabled={disabled || safeValue <= min}
        aria-label="Diminuir quantidade"
        className={cn(stepperButtonClass, "rounded-r-none")}
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        step={1}
        value={safeValue}
        onChange={handleInputChange}
        disabled={disabled}
        aria-label="Quantidade"
        className="h-11 w-16 border-0 bg-transparent text-center text-base font-semibold tabular focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={incrementar}
        disabled={disabled}
        aria-label="Aumentar quantidade"
        className={cn(stepperButtonClass, "rounded-l-none")}
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
