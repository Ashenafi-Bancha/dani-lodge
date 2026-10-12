import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // In development the website and API run separately; this makes /api reach the backend
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
