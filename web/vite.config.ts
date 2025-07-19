import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://10.126.126.2:8080',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: 'http://10.126.126.2:8080',
        changeOrigin: true,
        secure: false,
      },
      '/logout': {
        target: 'http://10.126.126.2:8080',
        changeOrigin: true,
        secure: false,
      },
      '/register': {
        target: 'http://10.126.126.2:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
