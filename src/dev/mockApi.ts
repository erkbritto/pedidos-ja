import { ApiError, type HealthResponse } from "@/types/api";
import type { Pedido, PedidoCreate, PedidoStatus } from "@/types/pedido";
import { mockPedidos } from "./mockData";

/**
 * Modo de demonstração — ativo somente quando VITE_USE_MOCKS=true.
 * Os dados vivem apenas em memória enquanto a página estiver aberta.
 * Não há persistência: nem localStorage, nem IndexedDB, nem banco.
 */
let pedidos: Pedido[] = mockPedidos.map((pedido) => ({ ...pedido }));
let nextId = pedidos.reduce((max, pedido) => Math.max(max, pedido.id), 0) + 1;

const LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export const mockApi = {
  getHealth(): Promise<HealthResponse> {
    return delay<HealthResponse>({ status: "ok" });
  },

  listPedidos(): Promise<Pedido[]> {
    return delay(pedidos.map((pedido) => ({ ...pedido })));
  },

  async getPedido(id: number): Promise<Pedido> {
    const found = pedidos.find((pedido) => pedido.id === id);
    if (!found) {
      await delay(null);
      throw new ApiError("Recurso não encontrado.", 404, { detail: "Pedido não encontrado" });
    }
    return delay({ ...found });
  },

  createPedido(input: PedidoCreate): Promise<Pedido> {
    const pedido: Pedido = {
      id: nextId++,
      cliente: input.cliente,
      produto: input.produto,
      quantidade: input.quantidade,
      valor_unitario: input.valor_unitario,
      valor_total: Number((input.quantidade * input.valor_unitario).toFixed(2)),
      status: "CRIADO",
      data_criacao: new Date().toISOString(),
    };
    pedidos = [...pedidos, pedido];
    return delay({ ...pedido });
  },

  async updatePedidoStatus(id: number, status: PedidoStatus): Promise<Pedido> {
    const index = pedidos.findIndex((pedido) => pedido.id === id);
    if (index < 0) {
      await delay(null);
      throw new ApiError("Recurso não encontrado.", 404, { detail: "Pedido não encontrado" });
    }
    const current = pedidos[index]!;
    const updated: Pedido = { ...current, status };
    pedidos = pedidos.map((pedido, i) => (i === index ? updated : pedido));
    return delay({ ...updated });
  },
};
