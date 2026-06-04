import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/todolist_Y/',
  server: {
    proxy: {
      '/poe-ninja': {
        target: 'https://poe.ninja',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/poe-ninja/, ''),
      },
    },
  },
});