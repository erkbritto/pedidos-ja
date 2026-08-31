export type PedidoStatus = "CRIADO" | "CONFIRMADO" | "CANCELADO";

export const PEDIDO_STATUS: readonly PedidoStatus[] = [
  "CRIADO",
  "CONFIRMADO",
  "CANCELADO",
] as const;

export interface Pedido {
  id: number;
  cliente: string;
  produto: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  status: PedidoStatus;
  data_criacao: string;
}

export interface PedidoCreate {
  cliente: string;
  produto: string;
  quantidade: number;
  valor_unitario: number;
}

export type PedidosResponse = Pedido[];
