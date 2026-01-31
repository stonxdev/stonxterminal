import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";
import pkg from "./package.json";

export default defineConfig({
  root: "src/renderer",
  base: "./",

  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },

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
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}"],
      },
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
