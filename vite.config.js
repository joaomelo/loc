import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    root: "./src",
    publicDir: "../assets",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      sourcemap: true,
    },
  };
});
