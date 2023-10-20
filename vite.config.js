import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  console.info(`bundling with vite with mode: '${mode}'`);

  return {
    root: ".",
  };
});
