import express, { type ErrorRequestHandler } from 'express'
import { mockProducts, type Product } from '../../shared/product'
import { sendError } from './errors'
import { ProductStore } from './productStore'
import { createProductsRouter } from './routes/products'
import authRouter from '../routes/auth'
import cookieParser from "cookie-parser";

/* BPK-71: POST/PUT /api/products have no auth yet, so they must never be reachable on a real
   deployment. They are on unless NODE_ENV is "production". Any host that runs this server for
   real must set NODE_ENV=production. */
export function writeRoutesEnabled(env: NodeJS.ProcessEnv = process.env) {
  return env.NODE_ENV !== 'production'
}

export interface AppOptions {
  /* Defaults to writeRoutesEnabled(). Tests pass false/true to check both modes. */
  enableWriteRoutes?: boolean
}

/* BPK-140: Builds the Express app without starting it, so tests can call it directly.
   Products default to the shared seed data, tests can pass their own list.
   BPK-71: Each app gets its own in-memory ProductStore copied from that list, so a fresh
   createApp() always starts from the seed data. */
export function createApp(products: readonly Product[] = mockProducts, options: AppOptions = {}) {
  const app = express()
  const store = new ProductStore(products)
  const enableWriteRoutes = options.enableWriteRoutes ?? writeRoutesEnabled()

  app.disable('x-powered-by')

  app.use(express.json());
  app.use(cookieParser());

  app.use('/api/products', createProductsRouter(store, { enableWriteRoutes }))

  app.use(authRouter);

  /* Any other /api route gets a JSON 404 instead of Express's HTML page */
  app.use('/api', (req, res) => {
    sendError(res, 404, 'NOT_FOUND', `No API route matches ${req.method} ${req.originalUrl}.`)
  })

  /* Unexpected errors: log the details on the server, send a generic JSON message.
     BPK-71: body-parser errors (bad JSON, body too big) are the client's fault, so they get a 4xx. */
  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err?.type === 'entity.parse.failed') {
      return sendError(res, 400, 'INVALID_JSON', 'Request body is not valid JSON.')
    }
    if (err?.type === 'entity.too.large') {
      return sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.')
    }
    console.error(err)
    return sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong on the server.')
  }
  app.use(errorHandler)

  return app
}
