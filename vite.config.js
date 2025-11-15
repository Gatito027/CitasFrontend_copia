import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts'
  }/*,
  server: {
    proxy: {
      '/api': {
        target: 'https://citaslogin.runasp.net',
        changeOrigin: true,
        secure: false,
      },
      '/p' :{
        target: 'https://profesional.runasp.net',
        changeOrigin: true,
        secure: false,
      }
    }
  }*/
})
