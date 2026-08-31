import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { APP_BASE_PATH } from "@/lib/env";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { TecnicoShell } from "@/components/layout/TecnicoLayout";

import { HomePage } from "@/pages/HomePage";
import { AdminOverviewPage } from "@/pages/admin/AdminOverviewPage";
import { AdminPedidosPage } from "@/pages/admin/AdminPedidosPage";
import { AdminPedidoDetalhePage } from "@/pages/admin/AdminPedidoDetalhePage";
import { ApiDocsPage } from "@/pages/ApiDocsPage";
import { ArquiteturaPage } from "@/pages/ArquiteturaPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Nunca fazer retry automático de mutações (POST/PATCH) — evita
        // criar pedidos duplicados ou reenviar alterações de status.
        retry: false,
      },
    },
  });
}

export function App() {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        {/* `basename` vem de `APP_BASE_PATH` (derivado de `import.meta.env.BASE_URL`,
            controlado por `VITE_APP_BASE_PATH` via `loadEnv` em vite.config.ts).
            Nenhuma rota ou link interno tem prefixo fixo. */}
        <BrowserRouter basename={APP_BASE_PATH}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="pedidos" element={<AdminPedidosPage />} />
              <Route path="pedidos/:id" element={<AdminPedidoDetalhePage />} />
            </Route>

            <Route
              path="/api"
              element={
                <TecnicoShell>
                  <ApiDocsPage />
                </TecnicoShell>
              }
            />
            <Route
              path="/arquitetura"
              element={
                <TecnicoShell>
                  <ArquiteturaPage />
                </TecnicoShell>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
