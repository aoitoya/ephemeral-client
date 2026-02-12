// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate SSL certificates for localhost if they don't exist
const certPath = resolve(__dirname, "localhost.crt");
const keyPath = resolve(__dirname, "localhost.key");

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.log("[Vite] Generating SSL certificates for localhost...");
}

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      https: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
      proxy: {
        "/api": {
          target: "https://localhost:3000",
          changeOrigin: true,
          secure: false,
          configure: (_proxy, _options) => {
            _proxy.on("proxyRes", (proxyRes) => {
              const setCookie = proxyRes.headers["set-cookie"];
              if (setCookie) {
                console.log("[Proxy] Set-Cookie received:", setCookie);
              }
            });
          },
        },
        "/socket.io": {
          target: "https://localhost:3000",
          ws: true,
          secure: false,
        },
      },
      host: true,
    },
  };
});
