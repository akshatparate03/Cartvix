import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // Tailwind v4 Vite plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // replaces postcss plugin in v4
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
