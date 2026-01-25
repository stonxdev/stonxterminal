import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: "src/renderer",
  base: "./",

  resolve: {
    alias: {
      "@renderer": resolve(__dirname, "src/renderer/src"),
    },
  },

  css: {
    modules: {
      localsConvention: "camelCase",
    },
    postcss: {
      plugins: [tailwindcss()],
    },
  },

  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/fonts/Source_Code_Pro/**/*",
          dest: "assets/fonts/Source_Code_Pro",
        },
      ],
    }),
  ],

  build: {
    outDir: resolve(__dirname, "dist-web"),
    emptyOutDir: true,
    sourcemap: true,
  },

  server: {
    port: 5173,
  },
});
