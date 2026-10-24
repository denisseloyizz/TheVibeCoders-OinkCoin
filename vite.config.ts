import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths so the build works under the GitHub Pages repo subpath.
  base: './',
  // GitHub Pages serves the committed build from main /docs.
  build: { outDir: 'docs', emptyOutDir: true },
});
