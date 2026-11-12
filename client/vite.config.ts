import { fileURLToPath } from 'node:url'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bpk/',
  server: {
    fs: {
      /* BPK-140: allow the dev server to load shared/ (product type + seed data) from outside client/ */
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        fileURLToPath(new URL('../shared', import.meta.url)),
      ],
    },
  },
})
