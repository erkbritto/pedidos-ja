import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/services/api/health";
import type { HealthResponse } from "@/types/api";

export const healthQueryKey = ["health"] as const;

export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: healthQueryKey,
    queryFn: ({ signal }) => getHealth(signal),
    refetchInterval: 30_000,
    retry: 1,
    staleTime: 10_000,
  });
}
