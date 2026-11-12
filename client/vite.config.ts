import { fileURLToPath } from 'node:url'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bpk/',
  server: {
    /* BPK-140: forward /api requests to the backend in server/ so the app and API share one origin (no CORS) */
    proxy: {
      '/api': 'http://localhost:3001',
    },
    fs: {
      /* BPK-140: allow the dev server to load shared/ (product type + seed data) from outside client/ */
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        fileURLToPath(new URL('../shared', import.meta.url)),
      ],
    },
  },
})
