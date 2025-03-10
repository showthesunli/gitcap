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
          react: ['react', 'react-dom', 'react-router-dom'],
          // 分离其他大型UI库（如果有的话）
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-slider', 'lucide-react'],
        }
      }
    }
  }
});
