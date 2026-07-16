import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // Allow Cloudflare quick-tunnel hostnames to reach the preview server
    allowedHosts: ['.trycloudflare.com'],
  },
})
