import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handlePQRS } from './api/pqrs.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-pqrs-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split('?')[0]
          if (url === '/api/pqrs' || url === '/api/pqrs/') {
            handlePQRS(req, res)
            return
          }
          next()
        })
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
