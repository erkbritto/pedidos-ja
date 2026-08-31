import { USE_MOCKS } from "@/lib/env";
import { mockApi } from "@/dev/mockApi";
import { apiRequest } from "./client";
import type { HealthResponse } from "@/types/api";

export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  if (USE_MOCKS) return mockApi.getHealth();
  return apiRequest<HealthResponse>("/health", { method: "GET", signal });
}
