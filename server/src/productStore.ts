import type { Product } from '../../shared/product'

/* BPK-71: In-memory product collection shared by the GET and write endpoints.
   It starts as a deep copy of the seed list, so creates and updates show up in GET responses
   while the server runs, but never change shared/product.ts or the seed array itself.
   Everything resets when the server restarts. There is no database yet. */
export class ProductStore {
  private items: Product[]

  constructor(seed: readonly Product[]) {
    this.items = structuredClone([...seed])
  }

  list(): readonly Product[] {
    return this.items
  }

  get(id: string): Product | undefined {
    return this.items.find((item) => item.id === id)
  }

  has(id: string): boolean {
    return this.get(id) !== undefined
  }

  /* Next id in the "prod-001" style: one more than the highest number in use, at least 3 digits */
  nextId(): string {
    /* BigInt so ids with more digits than a JS number can hold still count up correctly */
    const highest = this.items.reduce((max, item) => {
      const match = /^prod-(\d+)$/.exec(item.id)
      if (!match) return max
      const n = BigInt(match[1])
      return n > max ? n : max
    }, 0n)
    return `prod-${String(highest + 1n).padStart(3, '0')}`
  }

  /* Callers check has() first, the route turns a duplicate into a 409 */
  add(product: Product): Product {
    this.items.push(product)
    return product
  }

  /* Swaps the product with this id for a new one. Returns undefined if no product has that id. */
  replace(id: string, product: Product): Product | undefined {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) return undefined
    this.items[index] = product
    return product
  }
}
