import { z } from "zod";

export const pedidoFormSchema = z.object({
  cliente: z.string().trim().min(1, "Informe seu nome."),
  produto: z.string().trim().min(1, "Selecione um produto."),
  quantidade: z
    .number({ invalid_type_error: "Informe uma quantidade numérica." })
    .int("A quantidade deve ser um número inteiro.")
    .min(1, "A quantidade deve ser pelo menos 1."),
  valor_unitario: z
    .number({ invalid_type_error: "Informe um valor unitário numérico." })
    .gt(0, "O valor unitário deve ser maior que zero."),
});

export type PedidoFormValues = z.infer<typeof pedidoFormSchema>;
