import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    base: '/f25-cisc275-brown/',
    plugins: [react()],
    optimizeDeps: {
    exclude: ['pyodide']
  }
});


