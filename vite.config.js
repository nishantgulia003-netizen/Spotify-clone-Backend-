const { defineConfig } = require("vite");

module.exports = defineConfig({
  root: ".",
  server: {
    port: 5173,
    proxy: { "/api": "http://127.0.0.1:3000" },
  },
  build: { outDir: "client/dist", emptyOutDir: true },
});
