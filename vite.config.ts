import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import eslint from 'vite-plugin-eslint';
import path from 'path';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: { src: path.resolve('src/') },
  },
  plugins: [
    react(),
    eslint(),
    reactRefresh(),
    checker({
      typescript: true,
    }),
  ],
  build: {
    sourcemap: false,
    outDir: 'build',
  },
  server: {
    port: 3000,
    host: true,
  },
});
