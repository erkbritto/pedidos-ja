/**
 * Identificador de pedido válido: número inteiro maior que zero.
 * Usado para diferenciar "identificador inválido" de "pedido não encontrado".
 */
export function isValidPedidoId(value: unknown): value is number {
  const parsed = typeof value === "number" ? value : Number(String(value ?? "").trim());
  return Number.isInteger(parsed) && parsed > 0;
}

/** Converte a entrada em um identificador válido ou retorna `null`. */
export function parsePedidoId(value: unknown): number | null {
  const raw = String(value ?? "").trim();
  if (raw.length === 0) return null;
  const parsed = Number(raw);
  return isValidPedidoId(parsed) ? parsed : null;
}
