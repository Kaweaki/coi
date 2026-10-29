import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The config runs in Node; this keeps it free of an @types/node dependency.
declare const process: { env: Record<string, string | undefined> }

// base: './' keeps every asset relative, so the same build works on GitHub
// Pages project sites, in any subfolder, or opened from disk.
//
//   VITE_ALLOWED_HOST=preview.example.dev npm run dev
//
// allows a tunnel/preview hostname per process without committing it.
const allowedHost = process.env.VITE_ALLOWED_HOST

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: allowedHost ? [allowedHost] : [],
  },
})
