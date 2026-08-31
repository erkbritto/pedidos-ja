export interface HealthResponse {
  status: "ok";
}

export interface ValidationIssue {
  loc?: unknown[];
  msg?: string;
  type?: string;
}

export interface ApiErrorPayload {
  detail?: unknown;
  message?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly payload: ApiErrorPayload | undefined;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isValidation(): boolean {
    return this.status === 422 || this.status === 400;
  }

  /** status 0 representa falha de rede/timeout (sem resposta HTTP). */
  get isNetwork(): boolean {
    return this.status === 0;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown, fallback = "Ocorreu um erro inesperado."): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
