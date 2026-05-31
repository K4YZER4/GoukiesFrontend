import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    },
    middlewareMode: false
  },
  preview: {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  }
})
