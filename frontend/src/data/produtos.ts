/**
 * Catálogo visual estático da interface pública.
 *
 * Isto NÃO representa um serviço de Catálogo nem de Estoque: são apenas
 * opções pré-definidas no frontend para agilizar o preenchimento dos campos
 * `produto` e `valor_unitario` do Pedido. Não existe origem de dados (API,
 * banco, mock) para esses itens — eles vivem somente aqui, em memória, e não
 * geram nenhuma requisição HTTP nem endpoint novo.
 *
 * As imagens são arquivos locais em `public/products/` e não dependem de
 * internet externa para funcionar.
 */
export interface ProdutoVisual {
  id: string;
  nome: string;
  descricao: string;
  valorUnitario: number;
  categoria: string;
  imagem: string;
}

export const PRODUTOS_VISUAIS: readonly ProdutoVisual[] = [
  {
    id: "combo-hamburguer",
    nome: "Combo de Hambúrguer",
    descricao: "Hambúrguer artesanal, batata frita e refrigerante.",
    valorUnitario: 32.9,
    categoria: "Combos",
    imagem: "/products/combo-hamburguer.jpg",
  },
  {
    id: "hot-dog",
    nome: "Hot Dog",
    descricao: "Hot dog tradicional com molhos da casa.",
    valorUnitario: 18.9,
    categoria: "Lanches",
    imagem: "/products/hot-dog.jpg",
  },
  {
    id: "batata-frita",
    nome: "Batata Frita",
    descricao: "Porção de batatas fritas crocantes.",
    valorUnitario: 14.9,
    categoria: "Acompanhamentos",
    imagem: "/products/batata-frita.jpg",
  },
  {
    id: "refrigerante",
    nome: "Refrigerante",
    descricao: "Refrigerante gelado, copo de 500 ml.",
    valorUnitario: 7.9,
    categoria: "Bebidas",
    imagem: "/products/refrigerante.jpg",
  },
] as const;

/** Busca um produto do catálogo visual pelo identificador local. */
export function findProdutoVisual(id: string | undefined): ProdutoVisual | undefined {
  if (!id) return undefined;
  return PRODUTOS_VISUAIS.find((produto) => produto.id === id);
}

/** Filtro local por nome, descrição ou categoria. Nunca chama a API. */
export function filtrarProdutos(termo: string): readonly ProdutoVisual[] {
  const query = termo.trim().toLowerCase();
  if (query.length === 0) return PRODUTOS_VISUAIS;
  return PRODUTOS_VISUAIS.filter((produto) =>
    [produto.nome, produto.descricao, produto.categoria].some((campo) =>
      campo.toLowerCase().includes(query),
    ),
  );
}
