import express, { Router, type Response } from 'express'
import type { Product } from '../../../shared/product'
import { sendError } from '../errors'
import type { ProductStore } from '../productStore'
import { PRODUCT_ID_PATTERN, validateProductBody } from '../validateProduct'

export { PRODUCT_ID_PATTERN }

export interface ProductsRouterOptions {
  /* Registers POST and PUT. See writeRoutesEnabled() in app.ts for when this is on. */
  enableWriteRoutes: boolean
}

function sendInvalidId(res: Response, id: string) {
  return sendError(res, 400, 'INVALID_PRODUCT_ID', `Invalid product id "${id}". Expected a format like "prod-001".`)
}

function sendValidationErrors(res: Response, errors: string[]) {
  return sendError(res, 400, 'VALIDATION_ERROR', `Invalid product: ${errors.join('; ')}.`)
}

export function createProductsRouter(store: ProductStore, { enableWriteRoutes }: ProductsRouterOptions) {
  const router = Router()

  /* GET /api/products -> Product[] */
  router.get('/', (_req, res) => {
    res.json(store.list())
  })

  /* GET /api/products/:id -> Product, 400 for a malformed id, 404 if no product has that id */
  router.get('/:id', (req, res) => {
    const { id } = req.params

    if (!PRODUCT_ID_PATTERN.test(id)) {
      return sendInvalidId(res, id)
    }

    const product = store.get(id)
    if (!product) {
      return sendError(res, 404, 'PRODUCT_NOT_FOUND', `No product found with id "${id}".`)
    }

    return res.json(product)
  })

  /* BPK-71: The write endpoints have no authentication yet, so anyone who can reach the server
     could change the menu. They are only registered for local development and tests, never in
     production. When they are off, POST/PUT fall through to the JSON 404 like any unknown route. */
  if (!enableWriteRoutes) {
    return router
  }

  /* Only the write routes parse JSON bodies. Malformed JSON and oversized bodies are turned into
     400/413 JSON errors by the error handler in app.ts. */
  const parseJson = express.json({ limit: '100kb' })

  /* POST /api/products -> 201 with the created Product.
     "id" is optional: leave it out and the server assigns the next "prod-NNN",
     send one and it must be well formed (400) and not already used (409). */
  router.post('/', parseJson, (req, res) => {
    const result = validateProductBody(req.body)
    if (!result.ok) {
      return sendValidationErrors(res, result.errors)
    }

    const id = result.product.id ?? store.nextId()
    if (store.has(id)) {
      return sendError(res, 409, 'DUPLICATE_PRODUCT_ID', `A product with id "${id}" already exists.`)
    }

    const product: Product = { id, ...result.product }
    store.add(product)
    return res.status(201).location(`${req.baseUrl}/${id}`).json(product)
  })

  /* PUT /api/products/:id -> 200 with the updated Product.
     Full replace: the body is a complete product and any optional field left out
     (sizes, customizations, nutrition) is removed. "id" in the body is optional but must
     match the URL if sent, since ids can't be changed. */
  router.put('/:id', parseJson, (req, res) => {
    const { id } = req.params

    if (!PRODUCT_ID_PATTERN.test(id)) {
      return sendInvalidId(res, id)
    }

    if (!store.has(id)) {
      return sendError(res, 404, 'PRODUCT_NOT_FOUND', `No product found with id "${id}".`)
    }

    const result = validateProductBody(req.body)
    if (!result.ok) {
      return sendValidationErrors(res, result.errors)
    }
    if (result.product.id !== undefined && result.product.id !== id) {
      return sendValidationErrors(res, [`id "${result.product.id}" does not match the URL id "${id}"`])
    }

    const product: Product = { id, ...result.product }
    store.replace(id, product)
    return res.json(product)
  })

  return router
}
