/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const frontendRoot = path.resolve(__dirname, 'Frontend');
  const env = loadEnv(mode, '.', '');

  return {
    root: frontendRoot,
    envDir: __dirname,
    publicDir: path.resolve(__dirname, 'public'),
    plugins: [react(), tailwindcss()],
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true
    },
    resolve: {
      alias: {
        '@': path.resolve(frontendRoot, 'src')
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3001',
          changeOrigin: true
        }
      }
    },
    test: {
      environment: 'happy-dom',
      globals: false,
      clearMocks: true,
      include: ['Frontend/src/**/*.test.ts', 'Frontend/src/**/*.test.tsx']
    }
  };
});
