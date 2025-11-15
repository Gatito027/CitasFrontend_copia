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
<<<<<<< HEAD
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
=======
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://www.citaslogin.somee.com',
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29
        changeOrigin: true,
        secure: false,
      }
    }
<<<<<<< HEAD
  }*/
=======
  }
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29
})
