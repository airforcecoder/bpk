import { createApp, writeRoutesEnabled } from './app'

/* 3001 matches the /api proxy in client/vite.config.ts */
const PORT = Number(process.env.PORT) || 3001

createApp().listen(PORT, () => {
  console.log(`BPK API listening on http://localhost:${PORT}`)
  console.log(
    writeRoutesEnabled()
      ? 'Product write endpoints (POST/PUT /api/products) are ON for local development. Changes are in memory only.'
      : 'Product write endpoints are OFF (NODE_ENV=production).',
  )
})
