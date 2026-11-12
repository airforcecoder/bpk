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
| [`server/src/app.ts`](server/src/app.ts) | `createApp()` builds the Express app without starting it, which the tests use |
| [`server/src/routes/products.ts`](server/src/routes/products.ts) | The two product endpoints |
| [`server/src/errors.ts`](server/src/errors.ts) | The shared JSON error format |
| [`server/test/products.test.ts`](server/test/products.test.ts) | Endpoint tests, including the error cases |

### Where components could switch to the API later

BPK-140 adds the API without changing any existing components. These still use the mock data directly and are the places to switch over:

- **Menu page:** `client/src/pages/MenuPage.tsx` loads products through `getProducts()` in [`client/src/services/productService.ts`](client/src/services/productService.ts). Changing that one function to `fetch('/api/products')` switches the menu over with no component changes. A `getProductById()` for `/api/products/:id` belongs there too.
- **Product card and details modal:** `ProductCard.tsx` and `ProductDetailsModal.tsx` import the `Product` type from `client/src/data/mockProducts.ts`. They could import it from `shared/product.ts` directly, and then the re-export file can be deleted.
- **Home page:** `client/src/pages/HomePage.tsx` has its own hardcoded sizes, prices and flavors. They don't update when `shared/product.ts` changes.
- **Cart, order and search:** not built yet (cart and order are placeholders). Build them on the API from the start.
- **Admin dashboard:** `client/src/data/dashboardSummary.ts` has its own sample products.

### Known gaps

- **The live site has no API.** The GitHub Pages deploy only hosts the built frontend, so `/api` doesn't exist there and the Vite proxy is development only. Before production code calls the API, the backend needs a host and the frontend needs that URL (for example an env variable), or a fallback to the mock data.
- **Missing product images.** Only `og-nilla.jpg` and `margherita-pizza.jpg` exist in `client/public/images/`. The images for prod-003 to prod-006 don't, so those cards show "No image".
- **Large image.** `margherita-pizza.jpg` is about 10.6 MB and should be resized for use on product cards.
- **Placeholder products.** prod-002 to prod-006 (pizza, salad, fries, milkshake, sandwich) are sample data. OG Nilla is the only real BPK product so far.
