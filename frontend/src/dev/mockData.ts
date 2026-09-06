import type { Pedido } from "@/types/pedido";

export const mockPedidos: Pedido[] = [
  {
    id: 1,
    cliente: "Ana Souza",
    produto: "Combo de Hambúrguer",
    quantidade: 2,
    valor_unitario: 32.9,
    valor_total: 65.8,
    status: "CRIADO",
    data_criacao: "2026-09-01T18:30:00Z",
  },
  {
    id: 2,
    cliente: "Bruno Lima",
    produto: "Hot Dog",
    quantidade: 1,
    valor_unitario: 18.9,
    valor_total: 18.9,
    status: "CONFIRMADO",
    data_criacao: "2026-09-02T13:10:00Z",
  },
  {
    id: 3,
    cliente: "Carla Mendes",
    produto: "Batata Frita",
    quantidade: 3,
    valor_unitario: 14.9,
    valor_total: 44.7,
    status: "CANCELADO",
    data_criacao: "2026-09-03T09:20:00Z",
  },
  {
    id: 4,
    cliente: "Diego Alves",
    produto: "Refrigerante",
    quantidade: 4,
    valor_unitario: 7.9,
    valor_total: 31.6,
    status: "CRIADO",
    data_criacao: "2026-09-03T20:05:00Z",
  },
];
