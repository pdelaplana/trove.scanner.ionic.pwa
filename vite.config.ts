/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  define: {
    //'process.env': JSON.stringify(envFile),
  },
  resolve: {
    alias: {
      '@src': '/src',
      '@features': '/src/features',
      '@infrastructure': '/src/infrastructure',
      '@pages': '/src/pages',
      '@domain': '/src/domain',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      // Add more aliases as needed
    },
  },
});
