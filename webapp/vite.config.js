import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'oswaldo-unatrophied-algometrically.ngrok-free.dev'
    ],
    port: 5173
  }
})
