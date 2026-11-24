import { createApp, writeRoutesEnabled } from './app'

/* 3001 matches the /api proxy in client/vite.config.ts */
const PORT = Number(process.env.PORT) || 3001

const onListening = () => {
  console.log(`BPK API listening on http://localhost:${PORT}`)
  console.log(
    writeRoutesEnabled()
      ? 'Product write endpoints (POST/PUT /api/products) are ON for local development. Changes are in memory only.'
      : 'Product write endpoints are OFF. Start with --enable-product-writes (npm run dev does) to turn them on outside production.',
  )
}

/* BPK-71: the write endpoints have no auth, so while they are on only accept connections from this
   machine ('localhost' matches the Vite proxy target). Otherwise use Node's default (all interfaces). */
const app = createApp()
if (writeRoutesEnabled()) {
  app.listen(PORT, 'localhost', onListening)
} else {
  app.listen(PORT, onListening)
}
