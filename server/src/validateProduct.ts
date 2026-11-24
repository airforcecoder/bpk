import type { Product, ProductAvailability, ProductIngredients } from '../../shared/product'

/* BPK-71: Server-side validation for POST/PUT product bodies, based on the shared Product type.
   Hand-written so the server doesn't need a validation library. It collects every problem
   instead of stopping at the first one, so one 400 response tells the caller everything to fix.

   Rules:
   - The body must be a JSON object. Unknown fields are rejected at every level (typos like
     "prise" fail instead of being silently dropped).
   - Required: name, description, imageRef (non-blank strings), price (number >= 0),
     availability ("available" or "unavailable").
   - Optional: sizes, customizations, nutrition, with the same shapes as the Product type.
     Leave an optional field out to omit it; null is not accepted.
   - Strings are trimmed before they are stored. */

/* Product ids look like "prod-001". Anything else is rejected with 400 before we look it up. */
export const PRODUCT_ID_PATTERN = /^prod-\d+$/

const AVAILABILITY_VALUES = ['available', 'unavailable'] as const satisfies readonly ProductAvailability[]
/* Fails to compile if ProductAvailability gains a value that AVAILABILITY_VALUES is missing */
const availabilityValuesAreComplete: Exclude<ProductAvailability, (typeof AVAILABILITY_VALUES)[number]> extends never
  ? true
  : false = true
void availabilityValuesAreComplete

const NUTRITION_STATUS_VALUES = ['approved', 'pending'] as const satisfies readonly NonNullable<
  ProductIngredients['status']
>[]

const PRODUCT_FIELDS = [
  'id',
  'name',
  'description',
  'price',
  'imageRef',
  'availability',
  'sizes',
  'customizations',
  'nutrition',
] as const satisfies readonly (keyof Product)[]

export type ValidationResult =
  | { ok: true; product: Omit<Product, 'id'> & { id?: string } }
  | { ok: false; errors: string[] }

type PlainObject = Record<string, unknown>

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function typeLabel(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'an array'
  return `a ${typeof value}`
}

/* Small helper that remembers every error under a path like "sizes[1].price" */
class Checker {
  readonly errors: string[] = []

  fail(path: string, message: string) {
    this.errors.push(`${path} ${message}`)
  }

  unknownKeys(obj: PlainObject, allowed: readonly string[], path: string) {
    for (const key of Object.keys(obj)) {
      if (!allowed.includes(key)) {
        this.fail(path ? `${path}.${key}` : key, 'is not a known product field')
      }
    }
  }

  text(value: unknown, path: string): string | undefined {
    if (value === undefined) {
      this.fail(path, 'is required')
      return undefined
    }
    if (typeof value !== 'string') {
      this.fail(path, `must be a string, got ${typeLabel(value)}`)
      return undefined
    }
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      this.fail(path, 'must not be blank')
      return undefined
    }
    return trimmed
  }

  price(value: unknown, path: string): number | undefined {
    if (value === undefined) {
      this.fail(path, 'is required')
      return undefined
    }
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      this.fail(path, `must be a number, got ${typeLabel(value)}`)
      return undefined
    }
    if (value < 0) {
      this.fail(path, 'must not be negative')
      return undefined
    }
    return value
  }

  oneOf<T extends string>(value: unknown, allowed: readonly T[], path: string): T | undefined {
    if (value === undefined) {
      this.fail(path, 'is required')
      return undefined
    }
    if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
      this.fail(path, `must be one of ${allowed.map((v) => `"${v}"`).join(', ')}`)
      return undefined
    }
    return value as T
  }

  /* Array of objects with exactly these fields. Returns undefined if anything inside is invalid. */
  list<T>(value: unknown, path: string, readItem: (item: PlainObject, itemPath: string) => T | undefined) {
    if (!Array.isArray(value)) {
      this.fail(path, `must be an array, got ${typeLabel(value)}`)
      return undefined
    }
    const before = this.errors.length
    const items: T[] = []
    value.forEach((item, index) => {
      const itemPath = `${path}[${index}]`
      if (!isPlainObject(item)) {
        this.fail(itemPath, `must be an object, got ${typeLabel(item)}`)
        return
      }
      const parsed = readItem(item, itemPath)
      if (parsed !== undefined) items.push(parsed)
    })
    return this.errors.length === before ? items : undefined
  }

  textList(value: unknown, path: string): string[] | undefined {
    if (!Array.isArray(value)) {
      this.fail(path, `must be an array of strings, got ${typeLabel(value)}`)
      return undefined
    }
    const before = this.errors.length
    const items = value.map((item, index) => this.text(item, `${path}[${index}]`))
    return this.errors.length === before ? (items as string[]) : undefined
  }
}

function readSizes(c: Checker, value: unknown): Product['sizes'] {
  return c.list(value, 'sizes', (item, path) => {
    c.unknownKeys(item, ['name', 'price'], path)
    const name = c.text(item.name, `${path}.name`)
    const price = c.price(item.price, `${path}.price`)
    return name !== undefined && price !== undefined ? { name, price } : undefined
  })
}

function readCustomizations(c: Checker, value: unknown): Product['customizations'] {
  return c.list(value, 'customizations', (item, path) => {
    c.unknownKeys(item, ['id', 'name', 'price'], path)
    const id = c.text(item.id, `${path}.id`)
    const name = c.text(item.name, `${path}.name`)
    const price = c.price(item.price, `${path}.price`)
    return id !== undefined && name !== undefined && price !== undefined ? { id, name, price } : undefined
  })
}

function readNutrition(c: Checker, value: unknown): ProductIngredients | undefined {
  if (!isPlainObject(value)) {
    c.fail('nutrition', `must be an object, got ${typeLabel(value)}`)
    return undefined
  }
  c.unknownKeys(value, ['ingredients', 'allergens', 'status'], 'nutrition')
  const nutrition: ProductIngredients = {}
  if (value.ingredients !== undefined) {
    nutrition.ingredients = c.textList(value.ingredients, 'nutrition.ingredients')
  }
  if (value.allergens !== undefined) {
    nutrition.allergens = c.textList(value.allergens, 'nutrition.allergens')
  }
  if (value.status !== undefined) {
    nutrition.status = c.oneOf(value.status, NUTRITION_STATUS_VALUES, 'nutrition.status')
  }
  return nutrition
}

/* Validates a POST or PUT body. "id" is optional here, the routes decide what to do with it. */
export function validateProductBody(body: unknown): ValidationResult {
  if (!isPlainObject(body)) {
    return { ok: false, errors: [`Request body must be a JSON object, got ${typeLabel(body)}.`] }
  }

  const c = new Checker()
  c.unknownKeys(body, PRODUCT_FIELDS, '')

  let id: string | undefined
  if (body.id !== undefined) {
    if (typeof body.id !== 'string' || !PRODUCT_ID_PATTERN.test(body.id)) {
      c.fail('id', 'must look like "prod-001"')
    } else {
      id = body.id
    }
  }

  const name = c.text(body.name, 'name')
  const description = c.text(body.description, 'description')
  const price = c.price(body.price, 'price')
  const imageRef = c.text(body.imageRef, 'imageRef')
  const availability = c.oneOf(body.availability, AVAILABILITY_VALUES, 'availability')

  const sizes = body.sizes === undefined ? undefined : readSizes(c, body.sizes)
  const customizations = body.customizations === undefined ? undefined : readCustomizations(c, body.customizations)
  const nutrition = body.nutrition === undefined ? undefined : readNutrition(c, body.nutrition)

  if (
    c.errors.length > 0 ||
    name === undefined ||
    description === undefined ||
    price === undefined ||
    imageRef === undefined ||
    availability === undefined
  ) {
    return { ok: false, errors: c.errors }
  }

  /* Build a fresh object with only known fields, in the same order as the seed data */
  const product: Omit<Product, 'id'> & { id?: string } = {
    ...(id !== undefined && { id }),
    name,
    description,
    price,
    imageRef,
    availability,
    ...(sizes !== undefined && { sizes }),
    ...(customizations !== undefined && { customizations }),
    ...(nutrition !== undefined && { nutrition }),
  }
  return { ok: true, product }
}
