import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 分离Konva相关库
          konva: ['konva', 'react-konva'],
          // 分离React相关库
          react: ['react', 'react-dom']
          // 如果需要分离其他库，请确保它们已安装
          // ui: ['lucide-react'] // 仅保留确认已安装的库
        }
      }
    }
  }
});
