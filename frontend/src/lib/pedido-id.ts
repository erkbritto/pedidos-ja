/**
 * Converte uma entrada em um identificador de pedido estrito ou retorna null.
 * Strings aceitam somente dígitos ASCII; números precisam ser inteiros seguros.
 */
export function parsePedidoId(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  if (typeof value !== "string" || !/^[0-9]+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}
