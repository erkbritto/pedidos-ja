import type { ReactNode } from "react";
import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/components/common/StateBlocks";

/** Estado específico de 404 de pedido — distinto do 404 de página. */
export function PedidoNaoEncontrado({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      icon={<PackageSearch aria-hidden="true" className="size-5" />}
      title="Pedido não encontrado"
      description="Confira o número informado e tente novamente."
      action={action}
    />
  );
}

/** Estado de número de pedido inválido (precisa ser inteiro maior que zero). */
export function PedidoIdInvalido({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      icon={<PackageSearch aria-hidden="true" className="size-5" />}
      title="Número de pedido inválido"
      description="Use somente números maiores que zero."
      action={action}
    />
  );
}
