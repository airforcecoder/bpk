import { createApp } from './app'

/* 3001 matches the /api proxy in client/vite.config.ts */
const PORT = Number(process.env.PORT) || 3001

createApp().listen(PORT, () => {
  console.log(`BPK API listening on http://localhost:${PORT}`)
})
