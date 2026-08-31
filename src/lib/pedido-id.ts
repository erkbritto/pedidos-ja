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

/**
 * Versão estrita para entrada digitada pelo usuário: aceita somente
 * dígitos. Assim `"1e2"`, `"+4"`, `"4.0"` e `" 4 "` com lixo são rejeitados,
 * e não apenas convertidos silenciosamente.
 */
export function parsePedidoIdFromInput(value: string): number | null {
  const raw = value.trim();
  if (!/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}
