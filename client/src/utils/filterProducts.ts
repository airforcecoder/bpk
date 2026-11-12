export type AvailabilityFilter = 'all' | 'available' | 'unavailable'
export type SortOrder = 'default' | 'price-asc' | 'price-desc'

export type ProductFilters = {
  query: string
  availability: AvailabilityFilter
  sort: SortOrder
}

type FilterableProduct = {
  name: string
  description: string
  price: number
  availability: string
}

export const defaultFilters: ProductFilters = {
  query: '',
  availability: 'all',
  sort: 'default',
}

export function filterProducts<T extends FilterableProduct>(
  products: T[],
  filters: ProductFilters,
): T[] {
  const query = filters.query.trim().toLowerCase()

  const result = products.filter((product) => {
    const matchesQuery =
      query === '' ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)

    const matchesAvailability =
      filters.availability === 'all' ||
      product.availability === filters.availability

    return matchesQuery && matchesAvailability
  })

  if (filters.sort === 'price-asc') return result.sort((a, b) => a.price - b.price)
  if (filters.sort === 'price-desc') return result.sort((a, b) => b.price - a.price)
  return result
}