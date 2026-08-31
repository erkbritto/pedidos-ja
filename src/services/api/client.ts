import { buildApiUrl } from "@/lib/env";
import { ApiError, type ApiErrorPayload, type ValidationIssue } from "@/types/api";

const DEFAULT_TIMEOUT_MS = 10_000;

type HttpMethod = "GET" | "POST" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  timeoutMs?: number | undefined;
  signal?: AbortSignal | undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractValidationMessage(detail: unknown): string | null {
  if (typeof detail === "string") return detail;
  if (!Array.isArray(detail)) return null;

  const messages = detail
    .filter(isRecord)
    .map((issue) => {
      const item = issue as ValidationIssue;
      const field = Array.isArray(item.loc)
        ? item.loc.filter((part) => part !== "body").join(".")
        : "";
      const msg = typeof item.msg === "string" ? item.msg : "Valor inválido";
      return field ? `${field}: ${msg}` : msg;
    })
    .filter((message) => message.length > 0);

  return messages.length > 0 ? messages.join(" | ") : null;
}

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return "Requisição inválida.";
    case 404:
      return "Recurso não encontrado.";
    case 422:
      return "Os dados enviados não passaram na validação da API.";
    case 500:
      return "Erro interno na aplicação de pedidos.";
    default:
      return `A API respondeu com o status ${status}.`;
  }
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = "GET", body, timeoutMs = DEFAULT_TIMEOUT_MS, signal } = options;

  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  let response: Response;
  try {
    response = await fetch(buildApiUrl(path), {
      method,
      ...(body === undefined
        ? {}
        : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
      signal: controller.signal,
    });
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    // Diferencia timeout real de cancelamento interno de query (nova
    // requisição substituindo esta), evitando exibir "tempo limite" quando
    // o usuário simplesmente navegou para outra tela.
    if (aborted && !timedOut) {
      throw error;
    }
    throw new ApiError(
      aborted && timedOut
        ? "A API não respondeu dentro do tempo limite."
        : "Não foi possível conectar à API de pedidos.",
      0,
    );
  } finally {
    clearTimeout(timeout);
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    const errorPayload: ApiErrorPayload = isRecord(payload) ? (payload as ApiErrorPayload) : {};
    const detailMessage = extractValidationMessage(errorPayload.detail);
    const message =
      (typeof errorPayload.message === "string" ? errorPayload.message : null) ??
      detailMessage ??
      defaultMessageForStatus(response.status);
    throw new ApiError(message, response.status, errorPayload);
  }

  return payload as TResponse;
}
