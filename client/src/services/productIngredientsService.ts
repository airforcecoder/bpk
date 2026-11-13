/* BPK-138:52 Frontend static-file reader for ingredient and allergen details.
   This is NOT the backend API. It reads client/public/data/ProductIngredients.json.
   Kept separate from productService so a real API can replace this source later. */

import type { ProductIngredients } from '../../../shared/product'

const INGREDIENTS_URL = `${import.meta.env.BASE_URL}data/ProductIngredients.json`

/* The file is fetched once, then looked up in memory */
let cache: Promise<Map<string, ProductIngredients>> | null = null

/* Keeps only non-empty strings; returns undefined when nothing usable is left */
function cleanList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const items = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
  return items.length > 0 ? items : undefined
}

/* Turns one raw JSON entry into ProductIngredients, or null if it has no usable lists */
function normalizeEntry(raw: unknown): ProductIngredients | null {
  if (typeof raw !== 'object' || raw === null) return null
  const entry = raw as Record<string, unknown>

  const ingredients = cleanList(entry.ingredients)
  const allergens = cleanList(entry.allergens)
  if (!ingredients && !allergens) return null

  return {
    ingredients,
    allergens,
    /* Anything other than exactly 'approved' is treated as pending */
    status: entry.status === 'approved' ? 'approved' : 'pending',
  }
}

async function loadIngredients(): Promise<Map<string, ProductIngredients>> {
  const ingredientsById = new Map<string, ProductIngredients>()

  try {
    const response = await fetch(INGREDIENTS_URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data: unknown = await response.json()
    const products =
      typeof data === 'object' && data !== null
        ? (data as { products?: unknown }).products
        : undefined

    if (typeof products === 'object' && products !== null) {
      for (const [id, raw] of Object.entries(products)) {
        const entry = normalizeEntry(raw)
        if (entry) ingredientsById.set(id, entry)
      }
    }
  } catch (error) {
    /* Missing file, network problem, or invalid JSON: the page keeps working */
    console.warn('productIngredientsService: could not load product ingredients', error)
    cache = null /* let the next call try again */
  }

  return ingredientsById
}

/* Returns the ingredients and allergens for a product ID, or null when there are none
   (unknown ID, missing fields, or the file could not be read). Never throws. */
export async function getProductIngredients(
  productId: string
): Promise<ProductIngredients | null> {
  cache ??= loadIngredients()
  const ingredientsById = await cache
  return ingredientsById.get(productId) ?? null
}