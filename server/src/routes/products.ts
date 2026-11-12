import { Router } from 'express'
import type { Product } from '../../../shared/product'
import { sendError } from '../errors'

/* Product ids look like "prod-001". Anything else is rejected with 400 before we look it up. */
export const PRODUCT_ID_PATTERN = /^prod-\d+$/

export function createProductsRouter(products: readonly Product[]) {
  const router = Router()

  /* GET /api/products -> Product[] */
  router.get('/', (_req, res) => {
    res.json(products)
  })

  /* GET /api/products/:id -> Product, 400 for a malformed id, 404 if no product has that id */
  router.get('/:id', (req, res) => {
    const { id } = req.params

    if (!PRODUCT_ID_PATTERN.test(id)) {
      return sendError(
        res,
        400,
        'INVALID_PRODUCT_ID',
        `Invalid product id "${id}". Expected a format like "prod-001".`,
      )
    }

    const product = products.find((item) => item.id === id)
    if (!product) {
      return sendError(res, 404, 'PRODUCT_NOT_FOUND', `No product found with id "${id}".`)
    }

    return res.json(product)
  })

  return router
}
