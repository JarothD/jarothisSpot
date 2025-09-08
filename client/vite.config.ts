import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path"; // o: import path from "node:path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  },  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@pages": path.resolve(__dirname, "./src/pages"),      
      "@shared": path.resolve(__dirname, "./src/shared")
    }
  },
  build: {
    sourcemap: true
  }
});
