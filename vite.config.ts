import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env según el modo
  const env = loadEnv(mode, process.cwd(), '')
  
  const frontendPort = env.VITE_FRONTEND_PORT ? parseInt(env.VITE_FRONTEND_PORT) : 5173
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      port: frontendPort,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})