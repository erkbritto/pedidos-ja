import { USE_MOCKS } from "@/lib/env";
import { mockApi } from "@/dev/mockApi";
import { apiRequest } from "./client";
import type { Pedido, PedidoCreate, PedidoStatus, PedidosResponse } from "@/types/pedido";

export function listPedidos(signal?: AbortSignal): Promise<PedidosResponse> {
  if (USE_MOCKS) return mockApi.listPedidos();
  return apiRequest<PedidosResponse>("/pedidos", { method: "GET", signal });
}

export function getPedido(id: number, signal?: AbortSignal): Promise<Pedido> {
  if (USE_MOCKS) return mockApi.getPedido(id);
  return apiRequest<Pedido>(`/pedidos/${id}`, { method: "GET", signal });
}

export function createPedido(input: PedidoCreate): Promise<Pedido> {
  if (USE_MOCKS) return mockApi.createPedido(input);
  return apiRequest<Pedido>("/pedidos", { method: "POST", body: input });
}

export function updatePedidoStatus(id: number, status: PedidoStatus): Promise<Pedido> {
  if (USE_MOCKS) return mockApi.updatePedidoStatus(id, status);
  return apiRequest<Pedido>(`/pedidos/${id}/status`, { method: "PATCH", body: { status } });
}
