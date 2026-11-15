/* BPK-138: Frontend static-file reader for ingredient and allergen details.
   This is NOT the backend API. It reads client/public/data/ProductIngredients.json.
   Kept separate from productService so a real API can replace this source later. */

import type { ProductIngredients } from '../../../shared/product'

const INGREDIENTS_URL = `${import.meta.env.BASE_URL}data/productIngredients.json`

/* What callers get back. The function never throws, so the UI can show each case. */
export type ProductIngredientsResult =
  | { kind: 'found'; data: ProductIngredients }
  | { kind: 'not-found' }  // unknown ID, or an entry with no usable lists
  | { kind: 'error' }      // file missing, network problem, or invalid JSON

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

/* Throws on any file problem; getProductIngredients turns that into { kind: 'error' } */
async function loadIngredients(): Promise<Map<string, ProductIngredients>> {
  const response = await fetch(INGREDIENTS_URL)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data: unknown = await response.json()
  const products =
    typeof data === 'object' && data !== null
      ? (data as { products?: unknown }).products
      : undefined
  if (typeof products !== 'object' || products === null) {
    throw new Error('Unexpected file format')
  }

  const ingredientsById = new Map<string, ProductIngredients>()
  for (const [id, raw] of Object.entries(products)) {
    const entry = normalizeEntry(raw)
    if (entry) ingredientsById.set(id, entry)
  }
  return ingredientsById
}

export async function getProductIngredients(
  productId: string
): Promise<ProductIngredientsResult> {
  const pending = (cache ??= loadIngredients())
  try {
    const ingredientsById = await pending
    const data = ingredientsById.get(productId)
    return data ? { kind: 'found', data } : { kind: 'not-found' }
  } catch (error) {
    if (cache === pending) cache = null /* let the next call try again */
    console.warn('productIngredientsService: could not load product ingredients', error)
    return { kind: 'error' }
  }
}