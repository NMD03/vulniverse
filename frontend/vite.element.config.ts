import { resolve } from "node:path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      customElement: /\.ce\.vue$/,
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import'],
      },
    },
  },

  build: {
    lib: {
      entry: resolve(
        __dirname,
        "src/element.ts",
      ),
      formats: ["es"],
      fileName: () =>
        "vulniverse-editor.js",
    },

    outDir: "dist/element",
    emptyOutDir: true,
    sourcemap: true,
  },
});
