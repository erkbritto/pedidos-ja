/**
 * Configuração de ambiente do frontend.
 *
 * - `API_BASE_URL` vazio => mesma origem (cenário final, em que a aplicação
 *   FastAPI serve os arquivos estáticos da interface).
 * - `APP_BASE_PATH` é o prefixo em que a interface é montada. É lido de
 *   `import.meta.env.BASE_URL`, que o Vite preenche automaticamente a partir
 *   do `base` configurado em `vite.config.ts` (por sua vez controlado por
 *   `VITE_APP_BASE_PATH` via `loadEnv`). Usar `BASE_URL` em vez de reler a
 *   variável diretamente garante que o `basename` do React Router nunca
 *   fique dessincronizado do `base` real do build.
 * - `USE_MOCKS` habilita o modo de demonstração (somente desenvolvimento/preview).
 */
export const API_BASE_URL: string = (import.meta.env["VITE_API_BASE_URL"] ?? "")
  .trim()
  .replace(/\/$/, "");

export const APP_BASE_PATH: string = import.meta.env.BASE_URL || "/";

export const USE_MOCKS: boolean = (import.meta.env["VITE_USE_MOCKS"] ?? "").trim() === "true";

/**
 * Monta uma URL da API respeitando `VITE_API_BASE_URL`.
 * Nunca utiliza o base path da interface: `/health`, `/pedidos` e `/docs`
 * pertencem exclusivamente à aplicação FastAPI.
 */
export function buildApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

/** URL da documentação automática (OpenAPI/Swagger) exposta pela API. */
export const API_DOCS_URL: string = buildApiUrl("/docs");
