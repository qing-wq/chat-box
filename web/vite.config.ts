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
        configure: (proxy) => {
          // 确保cookie能正确传递
          proxy.on('proxyReq', (proxyReq, req) => {
            // 保持原始cookie
            if (req.headers.cookie) {
              proxyReq.setHeader('Cookie', req.headers.cookie);
            }
          });

          proxy.on('proxyRes', (proxyRes) => {
            // 确保Set-Cookie头能正确传递
            if (proxyRes.headers['set-cookie']) {
              // 修改cookie的domain和path，使其适用于前端域名
              const cookies = proxyRes.headers['set-cookie'];
              if (Array.isArray(cookies)) {
                proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                  cookie
                    .replace(/Domain=[^;]+;?/gi, 'Domain=localhost;')
                    .replace(/Path=[^;]+;?/gi, 'Path=/;')
                );
              }
            }
          });
        },
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
