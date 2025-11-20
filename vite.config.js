import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base URL para GitHub Pages
  // Cambia '/crud-product/' por el nombre de tu repositorio en GitHub
  // Si tu repo se llama "task-app", pon: '/task-app/'
  base: process.env.GITHUB_PAGES === 'true' ? '/crud-product/' : '/',
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimizaciones para producción
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})