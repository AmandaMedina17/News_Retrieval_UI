import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const port = process.env.FRONTEND_PORT ? parseInt(process.env.FRONTEND_PORT) : 3000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: port,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})