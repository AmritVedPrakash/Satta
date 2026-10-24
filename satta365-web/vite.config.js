import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/APIs': {
          target: env.VITE_API_PROXY_TARGET || 'https://sattareddyanna.com',
          changeOrigin: true,
          secure: false,
          timeout: 45000,
          proxyTimeout: 45000,
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (!res.headersSent && typeof res.writeHead === 'function') {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Authentication backend is unavailable.' }));
              }
            });
          },
        },
        '/SMS': {
          target: env.VITE_SMS_PROXY_TARGET || 'https://betzuno.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/SMS/, '/APIs'),
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (!res.headersSent && typeof res.writeHead === 'function') {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'SMS gateway is unavailable.' }));
              }
            });
          },
        },
      },
    },
  };
});
