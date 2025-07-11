import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: "src/renderer/src/fonts/Source_Code_Pro",
            dest: "assets/fonts",
          },
        ],
      }),
    ],
  },
});
