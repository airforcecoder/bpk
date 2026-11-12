import request from 'supertest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockProducts, type Product } from '../../shared/product'
import { createApp } from '../src/app'

const app = createApp()

/* Every error response must be JSON with { error: { code, message } } */
function expectJsonError(res: request.Response, status: number, code: string) {
  expect(res.status).toBe(status)
  expect(res.headers['content-type']).toMatch(/application\/json/)
  expect(res.body).toEqual({ error: { code, message: expect.any(String) } })
  expect(res.body.error.message.length).toBeGreaterThan(0)
}

describe('GET /api/products', () => {
  it('returns every product from the shared seed data', async () => {
    const res = await request(app).get('/api/products')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toEqual(mockProducts)
    expect(res.body).toHaveLength(mockProducts.length)
  })

  it('returns products with the fields the frontend uses', async () => {
    const res = await request(app).get('/api/products')

    for (const product of res.body as Product[]) {
      expect(product).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        imageRef: expect.any(String),
        availability: expect.stringMatching(/^(available|unavailable)$/),
      })
    }
  })

  it('returns an empty array when there are no products', async () => {
    const res = await request(createApp([])).get('/api/products')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('GET /api/products/:id', () => {
  it.each(mockProducts.map((product) => [product.id, product] as const))(
    'returns %s',
    async (id, product) => {
      const res = await request(app).get(`/api/products/${id}`)

      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toMatch(/application\/json/)
      expect(res.body).toEqual(product)
    },
  )

  it('includes sizes and customizations when a product has them', async () => {
    const res = await request(app).get('/api/products/prod-001')

    expect(res.body.sizes).toHaveLength(7)
    expect(res.body.customizations).toEqual([{ id: 'no-banana', name: 'No Banana', price: 0 }])
  })

  it.each(['prod-999', 'prod-000', 'prod-0011'])(
    'returns 404 PRODUCT_NOT_FOUND for a well-formed id with no product (%s)',
    async (id) => {
      const res = await request(app).get(`/api/products/${id}`)

      expectJsonError(res, 404, 'PRODUCT_NOT_FOUND')
      expect(res.body.error.message).toContain(id)
    },
  )

  it.each([
    'abc',
    '123',
    'prod-',
    'prod-abc',
    'PROD-001',
    'prod-001abc',
    'prod-1.5',
    'prod-001%20',
    '%20prod-001',
  ])('returns 400 INVALID_PRODUCT_ID for a malformed id (%s)', async (id) => {
    const res = await request(app).get(`/api/products/${id}`)

    expectJsonError(res, 400, 'INVALID_PRODUCT_ID')
  })
})

describe('other API routes', () => {
  it('returns a JSON 404 for an unknown /api route', async () => {
    const res = await request(app).get('/api/not-a-route')

    expectJsonError(res, 404, 'NOT_FOUND')
  })

  it('returns a JSON 404 for an unsupported method on /api/products', async () => {
    const res = await request(app).post('/api/products').send({ name: 'New product' })

    expectJsonError(res, 404, 'NOT_FOUND')
  })
})

describe('unexpected errors', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a generic JSON 500 without leaking error details', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const brokenProducts = [...mockProducts]
    brokenProducts.find = () => {
      throw new Error('database exploded')
    }

    const res = await request(createApp(brokenProducts)).get('/api/products/prod-001')

    expectJsonError(res, 500, 'INTERNAL_ERROR')
    expect(JSON.stringify(res.body)).not.toContain('database exploded')
    expect(console.error).toHaveBeenCalled()
  })
})
