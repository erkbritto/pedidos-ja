import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Rascunho de UM pedido — não é um carrinho de múltiplos itens.
 *
 * O modelo acadêmico do Trabalho 1 define `Pedido` com um único `produto` e
 * uma única `quantidade`. Portanto o "carrinho" público guarda no máximo um
 * produto: escolher outro substitui o rascunho atual.
 *
 * Estado apenas em memória (sem localStorage): é rascunho, não fonte de
 * verdade. A fonte de verdade é sempre a API (`GET /pedidos/{id}`).
 */
export interface PedidoDraft {
  produtoId: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
}

interface CarrinhoContextValue {
  draft: PedidoDraft | null;
  /** Define/substitui o produto do rascunho. */
  definirDraft: (draft: PedidoDraft) => void;
  /** Altera somente a quantidade do rascunho existente. */
  definirQuantidade: (quantidade: number) => void;
  limpar: () => void;
  /** 0 ou 1 — nunca a quantidade total. */
  itensNoCarrinho: number;
  subtotal: number;
}

const CarrinhoContext = createContext<CarrinhoContextValue | null>(null);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PedidoDraft | null>(null);

  const value = useMemo<CarrinhoContextValue>(() => {
    return {
      draft,
      definirDraft: (novo) => setDraft(novo),
      definirQuantidade: (quantidade) =>
        setDraft((atual) =>
          atual ? { ...atual, quantidade: Math.max(1, Math.trunc(quantidade)) } : atual,
        ),
      limpar: () => setDraft(null),
      itensNoCarrinho: draft ? 1 : 0,
      subtotal: draft ? draft.quantidade * draft.valorUnitario : 0,
    };
  }, [draft]);

  return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho(): CarrinhoContextValue {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho precisa estar dentro de <CarrinhoProvider>.");
  }
  return context;
}
