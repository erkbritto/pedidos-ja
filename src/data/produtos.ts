/**
 * Catálogo visual estático da interface pública.
 *
 * Isto NÃO representa um serviço de Catálogo nem de Estoque: são apenas
 * opções pré-definidas no frontend para agilizar o preenchimento dos campos
 * `produto` e `valor_unitario` do Pedido. Não existe origem de dados (API,
 * banco, mock) para esses itens — eles vivem somente aqui, em memória, e não
 * geram nenhuma requisição HTTP nem endpoint novo.
 */
export interface ProdutoVisual {
  id: string;
  nome: string;
  descricao: string;
  valorUnitario: number;
  categoria: string;
}

export const PRODUTOS_VISUAIS: readonly ProdutoVisual[] = [
  {
    id: "combo-hamburguer",
    nome: "Combo de Hambúrguer",
    descricao: "Hambúrguer, batata frita e refrigerante.",
    valorUnitario: 32.9,
    categoria: "Combos",
  },
  {
    id: "hot-dog",
    nome: "Hot Dog",
    descricao: "Hot dog tradicional.",
    valorUnitario: 18.9,
    categoria: "Lanches",
  },
  {
    id: "batata-frita",
    nome: "Batata Frita",
    descricao: "Porção de batatas fritas.",
    valorUnitario: 14.9,
    categoria: "Acompanhamentos",
  },
  {
    id: "refrigerante",
    nome: "Refrigerante",
    descricao: "Refrigerante gelado.",
    valorUnitario: 7.9,
    categoria: "Bebidas",
  },
] as const;
