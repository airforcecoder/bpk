import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockProducts, type Product } from '../../shared/product'
import { createApp, ENABLE_WRITES_FLAG, writeRoutesEnabled } from '../src/app'
import { ProductStore } from '../src/productStore'

/* BPK-75: Tests for POST/PUT /api/products (BPK-71).
   beforeEach builds a new app, and every app has its own in-memory store copied from the seed
   data, so no test sees another test's creates or updates and the order doesn't matter. */

let app: ReturnType<typeof createApp>
const seedSnapshot = structuredClone(mockProducts)

beforeEach(() => {
  app = createApp(mockProducts, { enableWriteRoutes: true })
})

afterEach(() => {
  /* Writes must never leak into the shared seed array */
  expect(mockProducts).toEqual(seedSnapshot)
})

function expectJsonError(res: request.Response, status: number, code: string) {
  expect(res.status).toBe(status)
  expect(res.headers['content-type']).toMatch(/application\/json/)
  expect(res.body).toEqual({ error: { code, message: expect.any(String) } })
  expect(res.body.error.message.length).toBeGreaterThan(0)
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Strawberry Shortcake',
    description: 'Vanilla pudding with strawberries and shortcake crumbles.',
    price: 10,
    imageRef: '/images/strawberry-shortcake.jpg',
    availability: 'available',
    ...overrides,
  }
}

function without(key: string) {
  const body: Record<string, unknown> = validBody()
  delete body[key]
  return body
}

const REQUIRED_FIELDS = ['name', 'description', 'price', 'imageRef', 'availability']

describe('POST /api/products', () => {
  it('creates a product, assigns the next id and returns 201', async () => {
    const res = await request(app).post('/api/products').send(validBody())

    expect(res.status).toBe(201)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.headers.location).toBe('/api/products/prod-008')
    expect(res.body).toEqual({ id: 'prod-008', ...validBody() })
  })

  it('accepts optional sizes, customizations and nutrition', async () => {
    const body = validBody({
      sizes: [{ name: 'Mini (8oz)', price: 10 }],
      customizations: [{ id: 'no-banana', name: 'No Banana', price: 0 }],
      nutrition: { ingredients: ['milk', 'strawberries'], allergens: ['milk'], status: 'approved' },
    })

    const res = await request(app).post('/api/products').send(body)

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ id: 'prod-008', ...body })
  })

  it('uses a client-supplied id when it is well formed and unused', async () => {
    const res = await request(app).post('/api/products').send(validBody({ id: 'prod-100' }))

    expect(res.status).toBe(201)
    expect(res.body.id).toBe('prod-100')
  })

  it('assigns ids after the highest one in use', async () => {
    await request(app).post('/api/products').send(validBody({ id: 'prod-100' }))
    const res = await request(app).post('/api/products').send(validBody())

    expect(res.body.id).toBe('prod-101')
  })

  it('trims strings before storing them', async () => {
    const res = await request(app).post('/api/products').send(validBody({ name: '  Spaced Out  ' }))

    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Spaced Out')
  })

  it('accepts a price of 0', async () => {
    const res = await request(app).post('/api/products').send(validBody({ price: 0 }))

    expect(res.status).toBe(201)
    expect(res.body.price).toBe(0)
  })

  it('returns 409 DUPLICATE_PRODUCT_ID when the id is already used', async () => {
    const res = await request(app).post('/api/products').send(validBody({ id: 'prod-001' }))

    expectJsonError(res, 409, 'DUPLICATE_PRODUCT_ID')
    expect(res.body.error.message).toContain('prod-001')
  })

  it.each(REQUIRED_FIELDS)('returns 400 VALIDATION_ERROR when %s is missing', async (field) => {
    const res = await request(app).post('/api/products').send(without(field))

    expectJsonError(res, 400, 'VALIDATION_ERROR')
    expect(res.body.error.message).toContain(`${field} is required`)
  })

  it('lists every problem in one response', async () => {
    const res = await request(app).post('/api/products').send({ price: -1 })

    expectJsonError(res, 400, 'VALIDATION_ERROR')
    for (const field of ['name', 'description', 'imageRef', 'availability']) {
      expect(res.body.error.message).toContain(`${field} is required`)
    }
    expect(res.body.error.message).toContain('price must not be negative')
  })

  it.each([
    ['negative', -0.01, 'price must not be negative'],
    ['a string', '9.00', 'price must be a number'],
    ['null', null, 'price must be a number'],
    ['a boolean', true, 'price must be a number'],
  ])('returns 400 VALIDATION_ERROR when price is %s', async (_label, price, message) => {
    const res = await request(app).post('/api/products').send(validBody({ price }))

    expectJsonError(res, 400, 'VALIDATION_ERROR')
    expect(res.body.error.message).toContain(message)
  })

  it.each(['sold-out', 'Available', '', 1, null])(
    'returns 400 VALIDATION_ERROR for availability %j',
    async (availability) => {
      const res = await request(app).post('/api/products').send(validBody({ availability }))

      expectJsonError(res, 400, 'VALIDATION_ERROR')
      expect(res.body.error.message).toContain('availability must be one of "available", "unavailable"')
    },
  )

  it.each([
    ['name is blank', { name: '   ' }, 'name must not be blank'],
    ['name is a number', { name: 42 }, 'name must be a string'],
    ['id is malformed', { id: 'PROD-001' }, 'id must look like "prod-001"'],
    ['id is a number', { id: 8 }, 'id must look like "prod-001"'],
    ['there is an unknown field', { prise: 9 }, 'prise is not a known product field'],
    ['sizes is not an array', { sizes: 'Mini' }, 'sizes must be an array'],
    ['a size has a negative price', { sizes: [{ name: 'Mini', price: -1 }] }, 'sizes[0].price must not be negative'],
    ['a size has an extra field', { sizes: [{ name: 'Mini', price: 1, oz: 8 }] }, 'sizes[0].oz is not a known'],
    ['a customization is missing its id', { customizations: [{ name: 'X', price: 0 }] }, 'customizations[0].id is required'],
    ['nutrition.status is invalid', { nutrition: { status: 'done' } }, 'nutrition.status must be one of'],
    ['nutrition.allergens has a non-string', { nutrition: { allergens: [1] } }, 'nutrition.allergens[0] must be a string'],
    ['an optional field is null', { sizes: null }, 'sizes must be an array'],
  ])('returns 400 VALIDATION_ERROR when %s', async (_label, overrides, message) => {
    const res = await request(app).post('/api/products').send(validBody(overrides))

    expectJsonError(res, 400, 'VALIDATION_ERROR')
    expect(res.body.error.message).toContain(message)
  })

  it.each([
    ['an array', [validBody()]],
    ['an empty object', {}],
  ])('returns 400 VALIDATION_ERROR when the body is %s', async (_label, body) => {
    const res = await request(app).post('/api/products').send(body)

    expectJsonError(res, 400, 'VALIDATION_ERROR')
  })

  it('returns 400 VALIDATION_ERROR when the body is not sent as JSON', async () => {
    const res = await request(app).post('/api/products').type('form').send('name=Pudding&price=9')

    expectJsonError(res, 400, 'VALIDATION_ERROR')
    expect(res.body.error.message).toContain('must be a JSON object')
  })

  it('returns 400 INVALID_JSON for a malformed JSON body', async () => {
    const res = await request(app).post('/api/products').set('Content-Type', 'application/json').send('{"name": ')

    expectJsonError(res, 400, 'INVALID_JSON')
  })

  it('returns 413 PAYLOAD_TOO_LARGE for a huge body', async () => {
    const res = await request(app)
      .post('/api/products')
      .send(validBody({ description: 'x'.repeat(200 * 1024) }))

    expectJsonError(res, 413, 'PAYLOAD_TOO_LARGE')
  })

  it('does not store anything when validation fails', async () => {
    await request(app).post('/api/products').send(validBody({ price: -5 }))
    const res = await request(app).get('/api/products')

    expect(res.body).toEqual(mockProducts)
  })
})

describe('PUT /api/products/:id', () => {
  it('replaces the product and returns 200', async () => {
    const body = validBody({ name: 'OG Nilla Deluxe', price: 12, availability: 'unavailable' })

    const res = await request(app).put('/api/products/prod-001').send(body)

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toEqual({ id: 'prod-001', ...body })
  })

  it('is a full replace: optional fields left out are removed', async () => {
    const res = await request(app).put('/api/products/prod-001').send(validBody())

    expect(res.status).toBe(200)
    expect(res.body).not.toHaveProperty('sizes')
    expect(res.body).not.toHaveProperty('customizations')
  })

  it('accepts an id in the body when it matches the URL', async () => {
    const res = await request(app).put('/api/products/prod-002').send(validBody({ id: 'prod-002' }))

    expect(res.status).toBe(200)
    expect(res.body.id).toBe('prod-002')
  })

  it('returns 400 VALIDATION_ERROR when the body id does not match the URL', async () => {
    const res = await request(app).put('/api/products/prod-002').send(validBody({ id: 'prod-003' }))

    expectJsonError(res, 400, 'VALIDATION_ERROR')
    expect(res.body.error.message).toContain('does not match')
  })

  it.each(['abc', 'PROD-001', 'prod-', 'prod-1.5'])(
    'returns 400 INVALID_PRODUCT_ID for a malformed id (%s)',
    async (id) => {
      const res = await request(app).put(`/api/products/${id}`).send(validBody())

      expectJsonError(res, 400, 'INVALID_PRODUCT_ID')
    },
  )

  it('returns 404 PRODUCT_NOT_FOUND when no product has that id', async () => {
    const res = await request(app).put('/api/products/prod-999').send(validBody())

    expectJsonError(res, 404, 'PRODUCT_NOT_FOUND')
    expect(res.body.error.message).toContain('prod-999')
  })

  it('does not create a product when the id is missing', async () => {
    await request(app).put('/api/products/prod-999').send(validBody())
    const res = await request(app).get('/api/products/prod-999')

    expect(res.status).toBe(404)
  })

  it.each(REQUIRED_FIELDS)('returns 400 VALIDATION_ERROR when %s is missing', async (field) => {
    const res = await request(app).put('/api/products/prod-001').send(without(field))

    expectJsonError(res, 400, 'VALIDATION_ERROR')
    expect(res.body.error.message).toContain(`${field} is required`)
  })

  it('returns 400 VALIDATION_ERROR for an invalid price', async () => {
    const res = await request(app).put('/api/products/prod-001').send(validBody({ price: -1 }))

    expectJsonError(res, 400, 'VALIDATION_ERROR')
    expect(res.body.error.message).toContain('price must not be negative')
  })

  it('returns 400 VALIDATION_ERROR for an invalid availability', async () => {
    const res = await request(app).put('/api/products/prod-001').send(validBody({ availability: 'sold-out' }))

    expectJsonError(res, 400, 'VALIDATION_ERROR')
    expect(res.body.error.message).toContain('availability must be one of')
  })

  it('leaves the product unchanged when validation fails', async () => {
    await request(app).put('/api/products/prod-001').send(validBody({ price: -1 }))
    const res = await request(app).get('/api/products/prod-001')

    expect(res.body).toEqual(mockProducts[0])
  })
})

describe('GET endpoints reflect writes', () => {
  it('returns a created product from GET /api/products and GET /api/products/:id', async () => {
    const created = await request(app).post('/api/products').send(validBody())

    const list = await request(app).get('/api/products')
    expect(list.status).toBe(200)
    expect(list.body).toHaveLength(mockProducts.length + 1)
    expect(list.body.at(-1)).toEqual(created.body)

    const one = await request(app).get(`/api/products/${created.body.id}`)
    expect(one.status).toBe(200)
    expect(one.body).toEqual(created.body)
  })

  it('returns an updated product from GET /api/products and GET /api/products/:id', async () => {
    const updated = await request(app).put('/api/products/prod-003').send(validBody({ name: 'Renamed' }))

    const list = await request(app).get('/api/products')
    expect(list.body).toHaveLength(mockProducts.length)
    expect(list.body.find((p: Product) => p.id === 'prod-003')).toEqual(updated.body)

    const one = await request(app).get('/api/products/prod-003')
    expect(one.body).toEqual(updated.body)
  })

  it('starts each new app from the seed data', async () => {
    await request(app).post('/api/products').send(validBody())

    const res = await request(createApp()).get('/api/products')
    expect(res.body).toEqual(mockProducts)
  })
})

describe('dev-only gating', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('turns write routes on only with the flag, and never when NODE_ENV is production', () => {
    const withFlag = ['node', 'index.ts', ENABLE_WRITES_FLAG]
    const noFlag = ['node', 'index.ts']
    expect(writeRoutesEnabled({}, withFlag)).toBe(true)
    expect(writeRoutesEnabled({ NODE_ENV: 'development' }, withFlag)).toBe(true)
    expect(writeRoutesEnabled({ NODE_ENV: 'production' }, withFlag)).toBe(false)
    /* A host that forgets NODE_ENV is still safe */
    expect(writeRoutesEnabled({}, noFlag)).toBe(false)
    expect(writeRoutesEnabled({ NODE_ENV: 'staging' }, noFlag)).toBe(false)
  })

  it('does not register POST or PUT by default', async () => {
    const defaultApp = createApp()
    expectJsonError(await request(defaultApp).post('/api/products').send(validBody()), 404, 'NOT_FOUND')
    expectJsonError(await request(defaultApp).put('/api/products/prod-001').send(validBody()), 404, 'NOT_FOUND')
  })

  it('does not register POST or PUT when NODE_ENV is production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const prodApp = createApp()

    expectJsonError(await request(prodApp).post('/api/products').send(validBody()), 404, 'NOT_FOUND')
    expectJsonError(await request(prodApp).put('/api/products/prod-001').send(validBody()), 404, 'NOT_FOUND')

    /* Reads still work */
    const res = await request(prodApp).get('/api/products')
    expect(res.status).toBe(200)
    expect(res.body).toEqual(mockProducts)
  })

  it('does not register POST or PUT when enableWriteRoutes is false', async () => {
    const readOnlyApp = createApp(mockProducts, { enableWriteRoutes: false })

    expectJsonError(await request(readOnlyApp).post('/api/products').send(validBody()), 404, 'NOT_FOUND')
    expectJsonError(await request(readOnlyApp).put('/api/products/prod-001').send(validBody()), 404, 'NOT_FOUND')
  })
})

describe('review fixes', () => {
  it('keeps counting ids past what a JS number can hold', () => {
    const base = { name: 'a', description: 'b', price: 1, imageRef: 'c', availability: 'available' as const }
    const store = new ProductStore([{ ...base, id: 'prod-99999999999999999999' }])
    expect(store.nextId()).toBe('prod-100000000000000000000')
    store.add({ ...base, id: store.nextId() })
    expect(store.nextId()).toBe('prod-100000000000000000001')
    expect(new ProductStore([{ ...base, id: 'prod-9999999999999999999999' }]).nextId()).toBe(
      'prod-10000000000000000000000',
    )
  })

  it('auto-assigns a new id after a POST with a very large id', async () => {
    await request(app).post('/api/products').send(validBody({ id: 'prod-99999999999999999999' }))
    const first = await request(app).post('/api/products').send(validBody())
    const second = await request(app).post('/api/products').send(validBody())
    expect(first.status).toBe(201)
    expect(second.status).toBe(201)
    expect(second.body.id).not.toBe(first.body.id)
  })

  it('returns 415 JSON, not 500, for an unsupported charset', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Content-Type', 'application/json; charset=klingon')
      .send(JSON.stringify(validBody()))
    expectJsonError(res, 415, 'BAD_REQUEST')
  })

  it('returns 415 JSON, not 500, for an unsupported content encoding', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'nope')
      .send(JSON.stringify(validBody()))
    expectJsonError(res, 415, 'BAD_REQUEST')
  })
})
