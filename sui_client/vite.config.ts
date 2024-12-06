import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  optimizeDeps: {
    include: ["highlight.js"],
  },
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/node_modules/], // CommonJS 모듈을 변환할 경로 포함
    },
  },
  server: {
    proxy: {
      "/sui-api": {
        target: "http://127.0.0.1:9000/", // 풀노드 URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sui-api/, ""),
      },
    },
  },
});

