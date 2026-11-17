import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/commandes": "http://localhost:3001",
    },
  },
});
