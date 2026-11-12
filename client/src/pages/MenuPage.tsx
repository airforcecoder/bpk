import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/productService'
import type { Product } from '../data/mockProducts'

 /* Ians modal code to pop out details */
import ProductDetailsModal from '../components/ProductDetailsModal'

import './MenuPage.css'
import ProductSearchBar from '../components/ProductSearchBar'
import { defaultFilters, filterProducts } from '../utils/filterProducts'
import ProductFilterControls from '../components/ProductFilterControls'

function MenuPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

   /* Ians modal code to pop out details */
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [filters, setFilters] = useState(defaultFilters)

  useEffect(() => {
    let isCurrent = true

    getProducts()
      .then((data) => {
        if (isCurrent) setProducts(data)
      })
      .catch(() => {
        if (isCurrent) setHasError(true)
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const visibleProducts = filterProducts(products, filters)
  return (
    <main className="page-container menu-page">
      <h1 className="menu-page__title">Our Flavors</h1>

      {isLoading && <p className="menu-page__message">Loading menu...</p>}

      {hasError && (
        <p className="menu-page__message">
          Sorry, the menu could not be loaded. Please try again later.
        </p>
      )}

      {!isLoading && !hasError && products.length === 0 && (
        <p className="menu-page__message">No products are available right now.</p>
      )}

      {!isLoading && !hasError && products.length > 0 && (
  <>
    <div className="menu-page__toolbar">
      <ProductSearchBar
        value={filters.query}
        onChange={(query) => setFilters((current) => ({ ...current, query }))}
      />
      <ProductFilterControls
  availability={filters.availability}
  sort={filters.sort}
  onAvailabilityChange={(availability) =>
    setFilters((current) => ({ ...current, availability }))
  }
  onSortChange={(sort) => setFilters((current) => ({ ...current, sort }))}
/>
    </div>

    {visibleProducts.length === 0 ? (
  <div className="menu-page__message menu-page__empty" role="status">
    <p>No flavors match your search.</p>
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => setFilters(defaultFilters)}
    >
      Clear filters
    </button>
  </div>
) : (
  <section className="menu-page__grid" aria-label="Menu products">
    {visibleProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onSelect={setSelectedProduct}
      />
    ))}
  </section>
)}
  </>
)}


       {/* Ians modal code to pop out details */}
       {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
         />
)}
    </main>
  )
}

export default MenuPage