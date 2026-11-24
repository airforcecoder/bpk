# bpk
Banana Pudding Krazy Website

## Project layout

| Folder | What it is |
|---|---|
| `client/` | React + Vite frontend (deployed to GitHub Pages) |
| `server/` | Node + Express + TypeScript product API |
| `shared/` | Code used by both, currently the `Product` type and product seed data |

## Running locally

Needs Node 22 or newer.

```bash
# once, from the repo root: installs root, client and server packages
npm run install:all

# starts the frontend and the API together
npm run dev
```

- Frontend: http://localhost:5173/bpk/
- API: http://localhost:3001/api/products

`npm run dev` runs both with [concurrently](https://www.npmjs.com/package/concurrently). Output is labeled `[client]` and `[server]`, and the API restarts when you save a file in `server/` or `shared/`. Stop both with `Ctrl+C`.

To run only one side: `npm --prefix client run dev` or `npm --prefix server run dev`.

Other root scripts:

| Command | What it does |
|---|---|
| `npm test` | Runs the API tests (Vitest + Supertest) |
| `npm run typecheck` | Type checks the server and the client |
| `npm run build` | Builds the frontend into `client/dist` |
| `npm run lint` | Lints the frontend |

## Product API (BPK-140)

Product data lives in one place: [`shared/product.ts`](shared/product.ts). It defines the `Product` type and the seed products. The API serves it, and the frontend's existing `client/src/data/mockProducts.ts` re-exports it, so editing that one file updates both.

Product photos are not served by the API. Each product's `imageRef` (for example `/images/og-nilla.jpg`) points at a file in `client/public/images/`, and the browser loads it from the frontend.

### Endpoints

| Request | Response |
|---|---|
| `GET /api/products` | `200` with an array of all products |
| `GET /api/products/:id` | `200` with one product |
| `GET /api/products/:id` with a malformed id | `400` `INVALID_PRODUCT_ID` |
| `GET /api/products/:id` with an id no product has | `404` `PRODUCT_NOT_FOUND` |
| `POST /api/products` (dev only) | `201` with the created product, see [Writing products](#writing-products-bpk-59-dev-only) |
| `PUT /api/products/:id` (dev only) | `200` with the updated product |
| Any other `/api` route | `404` `NOT_FOUND` |
| Unexpected server error | `500` `INTERNAL_ERROR` |

Product ids look like `prod-001` (`prod-` followed by digits). Anything else, like `abc` or `PROD-001`, is a 400.

Every error uses the same JSON shape:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "No product found with id \"prod-999\"."
  }
}
```

### Writing products (BPK-59, dev only)

`POST` and `PUT` let you add and edit products while developing, for example to try out the menu with more products. They are a stepping stone to a real admin flow, not that flow yet.

**Changes are in memory only.** The server copies the seed products from `shared/product.ts` into memory when it starts. GET requests read from that copy, so creates and updates show up right away, but they are lost when the server restarts (including when `npm run dev` reloads after you save a file). `shared/product.ts` is never changed.

#### Dev-only gating

There is no authentication yet, so anyone who could reach these endpoints could change the menu. They are **off by default** and only registered when the server is started with `--enable-product-writes` and `NODE_ENV` is not `production`:

| Started with | POST / PUT |
|---|---|
| `npm run dev` (passes `--enable-product-writes`) | on |
| `npm start`, or anything without the flag | off: they return `404` `NOT_FOUND` like any unknown route |
| `NODE_ENV=production`, with or without the flag | off |

Because they are opt-in, a host that forgets to set `NODE_ENV` still doesn't expose them. The server logs which mode it is in when it starts. The check is `writeRoutesEnabled()` in [`server/src/app.ts`](server/src/app.ts).

#### POST /api/products

Creates a product and returns `201` with the product and a `Location` header such as `/api/products/prod-008`.

```bash
curl -X POST http://localhost:3001/api/products \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Strawberry Shortcake",
    "description": "Vanilla pudding with strawberries and shortcake crumbles.",
    "price": 10,
    "imageRef": "/images/strawberry-shortcake.jpg",
    "availability": "available",
    "sizes": [{ "name": "Mini (8oz)", "price": 10 }]
  }'
```

**Ids:** leave `id` out and the server assigns the next one (one more than the highest `prod-NNN` in use, so `prod-008` with the current seed data). You can send your own `id` instead. It must look like `prod-001` (`400` otherwise) and not already be used (`409` `DUPLICATE_PRODUCT_ID` otherwise).

#### PUT /api/products/:id

Replaces the product with that id and returns `200` with the new version.

**PUT is a full replace, not a partial update.** Send the whole product. Any optional field you leave out (`sizes`, `customizations`, `nutrition`) is removed. To change one field, GET the product, edit it, and PUT it back. `id` in the body is optional, but if you send it, it must match the URL, since ids can't be changed.

```bash
curl -X PUT http://localhost:3001/api/products/prod-003 \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Chocolate Oreo Blast",
    "description": "Chocolate pudding layered with Oreos and bananas.",
    "price": 9,
    "imageRef": "/images/chocolate-oreo-blast.jpg",
    "availability": "available",
    "sizes": [{ "name": "Mini (8oz)", "price": 9 }, { "name": "Selfie (16oz)", "price": 15 }]
  }'
```

#### Validation

Bodies are checked against the `Product` type in `shared/product.ts`:

| Field | Rule |
|---|---|
| `name`, `description`, `imageRef` | Required, non-blank strings (trimmed before saving) |
| `price` | Required number, `0` or more (`"9.00"` as a string is rejected) |
| `availability` | Required, `"available"` or `"unavailable"` |
| `id` | Optional, `prod-` followed by digits |
| `sizes` | Optional array of `{ name, price }` |
| `customizations` | Optional array of `{ id, name, price }` |
| `nutrition` | Optional `{ ingredients?: string[], allergens?: string[], status?: "approved" \| "pending" }` |

Unknown fields (at any level) and `null` values are rejected, so a typo like `"prise"` fails instead of being silently dropped. One `400` lists every problem in its message:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid product: name is required; price must not be negative."
  }
}
```

| Status | Code | When |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Body is missing, not a JSON object, or breaks a rule above |
| `400` | `INVALID_JSON` | Body isn't valid JSON |
| `400` | `INVALID_PRODUCT_ID` | PUT URL id is malformed |
| `404` | `PRODUCT_NOT_FOUND` | PUT to an id no product has (PUT never creates) |
| `409` | `DUPLICATE_PRODUCT_ID` | POST with an id that is already used |
| `413` | `PAYLOAD_TOO_LARGE` | Body is over 100 KB |
| `415` (or other `4xx`) | `BAD_REQUEST` | Body can't be read, for example an unsupported charset or `Content-Encoding` |

PUT checks happen in this order: URL id format (`400`), product exists (`404`), then the body (`400`).

### Calling the API from the frontend

In development the Vite dev server forwards every `/api` request to `http://localhost:3001` (see `server.proxy` in [`client/vite.config.ts`](client/vite.config.ts)). Components call relative URLs like `fetch('/api/products')` and no CORS setup is needed.

Example component:

```tsx
import { useEffect, useState } from 'react'
import type { Product } from '../../../shared/product'

function ProductListExample() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/products', { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json()
        // Error responses carry { error: { code, message } }
        if (!res.ok) throw new Error(body.error?.message ?? `Request failed (${res.status})`)
        setProducts(body as Product[])
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Could not load products')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    // Cancel the request if the component unmounts
    return () => controller.abort()
  }, [])

  if (isLoading) return <p>Loading products...</p>
  if (error) return <p>{error}</p>

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name}: ${product.price.toFixed(2)}
        </li>
      ))}
    </ul>
  )
}

export default ProductListExample
```

The import path assumes the file is in `client/src/components/`. For one product, fetch `/api/products/prod-001` and check `res.status` for `400` or `404`.

### Server code

| File | Purpose |
|---|---|
| [`server/src/index.ts`](server/src/index.ts) | Starts the API on port 3001 (override with the `PORT` env variable) |
| [`server/src/app.ts`](server/src/app.ts) | `createApp()` builds the Express app without starting it, which the tests use. Also has the dev-only `writeRoutesEnabled()` check |
| [`server/src/routes/products.ts`](server/src/routes/products.ts) | The product endpoints |
| [`server/src/productStore.ts`](server/src/productStore.ts) | The in-memory product list the endpoints read and write |
| [`server/src/validateProduct.ts`](server/src/validateProduct.ts) | Validation for POST/PUT bodies |
| [`server/src/errors.ts`](server/src/errors.ts) | The shared JSON error format |
| [`server/test/products.test.ts`](server/test/products.test.ts) | GET endpoint tests, including the error cases |
| [`server/test/products.write.test.ts`](server/test/products.write.test.ts) | POST/PUT tests. Each test gets a fresh app and store, so they don't depend on order |

### Where components could switch to the API later

BPK-140 adds the API without changing any existing components. These still use the mock data directly and are the places to switch over:

- **Menu page:** `client/src/pages/MenuPage.tsx` loads products through `getProducts()` in [`client/src/services/productService.ts`](client/src/services/productService.ts). Changing that one function to `fetch('/api/products')` switches the menu over with no component changes. A `getProductById()` for `/api/products/:id` belongs there too.
- **Product card and details modal:** `ProductCard.tsx` and `ProductDetailsModal.tsx` import the `Product` type from `client/src/data/mockProducts.ts`. They could import it from `shared/product.ts` directly, and then the re-export file can be deleted.
- **Home page:** `client/src/pages/HomePage.tsx` has its own hardcoded sizes, prices and flavors. They don't update when `shared/product.ts` changes.
- **Cart, order and search:** not built yet (cart and order are placeholders). Build them on the API from the start.
- **Admin dashboard:** `client/src/data/dashboardSummary.ts` has its own sample products.

### Known gaps

- **No persistence or auth for writes.** POST/PUT changes live in memory and there is no login, which is why they are dev only (see above). A database and admin authentication are follow-up work.
- **The live site has no API.** The GitHub Pages deploy only hosts the built frontend, so `/api` doesn't exist there and the Vite proxy is development only. Before production code calls the API, the backend needs a host and the frontend needs that URL (for example an env variable), or a fallback to the mock data.
- **Missing product images.** Only `og-nilla.jpg` and `margherita-pizza.jpg` exist in `client/public/images/`. The images for prod-003 to prod-006 don't, so those cards show "No image".
- **Large image.** `margherita-pizza.jpg` is about 10.6 MB and should be resized for use on product cards.
- **Placeholder products.** prod-002 to prod-006 (pizza, salad, fries, milkshake, sandwich) are sample data. OG Nilla is the only real BPK product so far.
