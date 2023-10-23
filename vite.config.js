import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    root: "./site",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      sourcemap: true,
    },
  };
});
