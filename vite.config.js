import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["6ff4-117-98-133-139.ngrok-free.app","katie-metals-playstation-collectables.trycloudflare.com"]
  },
  plugins: [react()],
})
