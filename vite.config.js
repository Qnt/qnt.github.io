import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import Inspect from 'vite-plugin-inspect';

export default defineConfig({
  publicDir: 'public',
  root: './',
  base: '/<REPO>/',
  build: {
    outDir: 'dist',
  },
  plugins: [
    eslint({
      cache: false,
      fix: true,
    }),
    Inspect({}),
  ],
});
