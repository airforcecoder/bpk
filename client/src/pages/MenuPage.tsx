import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/productService'
import type { Product } from '../data/mockProducts'
import './MenuPage.css'

function MenuPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

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
        <section className="menu-page__grid" aria-label="Menu products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  )
}

export default MenuPage