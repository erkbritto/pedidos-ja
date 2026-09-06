import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPedido, getPedido, listPedidos, updatePedidoStatus } from "@/services/api/pedidos";
import type { Pedido, PedidoCreate, PedidoStatus } from "@/types/pedido";

export const pedidosQueryKey = ["pedidos"] as const;
export const pedidoQueryKey = (id: number) => ["pedidos", id] as const;

export function usePedidos() {
  return useQuery<Pedido[]>({
    queryKey: pedidosQueryKey,
    queryFn: ({ signal }) => listPedidos(signal),
  });
}

export function usePedido(id: number) {
  return useQuery<Pedido>({
    queryKey: pedidoQueryKey(id),
    queryFn: ({ signal }) => getPedido(id, signal),
    enabled: Number.isSafeInteger(id) && id > 0,
    retry: false,
  });
}

export function useCreatePedido() {
  const queryClient = useQueryClient();
  return useMutation<Pedido, unknown, PedidoCreate>({
    mutationFn: (input) => createPedido(input),
    onSuccess: (pedido) => {
      queryClient.invalidateQueries({ queryKey: pedidosQueryKey });
      queryClient.setQueryData(pedidoQueryKey(pedido.id), pedido);
    },
  });
}

export function useUpdatePedidoStatus(id: number) {
  const queryClient = useQueryClient();
  return useMutation<Pedido, unknown, PedidoStatus>({
    mutationFn: (status) => updatePedidoStatus(id, status),
    onSuccess: (pedido) => {
      queryClient.invalidateQueries({ queryKey: pedidosQueryKey });
      queryClient.invalidateQueries({ queryKey: pedidoQueryKey(id) });
      queryClient.setQueryData(pedidoQueryKey(id), pedido);
    },
  });
}
