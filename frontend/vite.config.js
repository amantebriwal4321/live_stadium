import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/stream': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/setup': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/event': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/endmatch': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/state': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/startlive': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/stoplive': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
