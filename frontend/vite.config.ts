import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// A interface é compilada como SPA estática e servida pela mesma origem da
// API (cenário final: FastAPI serve tudo em `http://localhost:8000/`). O
// `base` do build precisa refletir exatamente `VITE_APP_BASE_PATH`, pois
// `import.meta.env.BASE_URL` (usado pelo React Router como `basename`, ver
// `src/lib/env.ts`) é derivado diretamente dele pelo Vite.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const rawBasePath = (env["VITE_APP_BASE_PATH"] ?? "/").trim();
  const appBasePath = rawBasePath === "" ? "/" : rawBasePath;
  const base = appBasePath.endsWith("/") ? appBasePath : `${appBasePath}/`;

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      {
        name: "dev-server-info",
        configureServer(server) {
          server.httpServer?.once("listening", () => {
            console.log("\n");
            console.log("  CLIENTE:");
            console.log("  http://localhost:5173/");
            console.log("  http://localhost:5173/produto/:id");
            console.log("  http://localhost:5173/carrinho");
            console.log("  http://localhost:5173/revisar");
            console.log("  http://localhost:5173/acompanhar");
            console.log("  http://localhost:5173/pedido/:id");
            console.log("\n");
            console.log("  ADMIN:");
            console.log("  http://localhost:5173/admin");
            console.log("  http://localhost:5173/admin/pedidos");
            console.log("  http://localhost:5173/admin/pedidos/:id");
            console.log("  http://localhost:5173/admin/api");
            console.log("  http://localhost:5173/admin/arquitetura");
            console.log("\n");
          });
        },
      },
    ],
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-query": ["@tanstack/react-query"],
          },
        },
      },
    },
    server: {
      port: 5173,
      open: false,
    },
  };
});
