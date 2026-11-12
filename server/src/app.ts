import express, { type ErrorRequestHandler } from 'express'
import { mockProducts, type Product } from '../../shared/product'
import { sendError } from './errors'
import { createProductsRouter } from './routes/products'

/* BPK-140: Builds the Express app without starting it, so tests can call it directly.
   Products default to the shared seed data, tests can pass their own list. */
export function createApp(products: readonly Product[] = mockProducts) {
  const app = express()

  app.disable('x-powered-by')

  app.use('/api/products', createProductsRouter(products))

  /* Any other /api route gets a JSON 404 instead of Express's HTML page */
  app.use('/api', (req, res) => {
    sendError(res, 404, 'NOT_FOUND', `No API route matches ${req.method} ${req.originalUrl}.`)
  })

  /* Unexpected errors: log the details on the server, send a generic JSON message */
  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err)
    sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong on the server.')
  }
  app.use(errorHandler)

  return app
}
