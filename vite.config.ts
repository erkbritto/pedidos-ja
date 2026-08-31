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
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          },
        },
      },
    },
    server: {
      port: 5173,
    },
  };
});
