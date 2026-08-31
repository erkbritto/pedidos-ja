const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return currencyFormatter.format(0);
  return currencyFormatter.format(value);
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

/** Formata a string ISO da API como "01/09/2026 às 15:30" (preserva o ISO original). */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateTimeFormatter.format(date).replace(", ", " às ");
}
