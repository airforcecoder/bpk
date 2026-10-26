import { useState } from 'react'
import type { Product } from '../data/mockProducts'
import './ProductCard.css'

type ProductCardProps = {
  product: Product
  onSelect?: (product: Product) => void
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function ProductCard({ product, onSelect }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const isUnavailable = product.availability === 'unavailable'

  return (
    <article
      className={isUnavailable ? 'product-card product-card--unavailable' : 'product-card'}
    >
      <button
        type="button"
        className="product-card__button"
        onClick={() => onSelect?.(product)}
      >
        <span className="product-card__media">
          {imageFailed ? (
            <span className="product-card__placeholder" aria-hidden="true">
              No image
            </span>
          ) : (
            <img
              className="product-card__image"
              src={`${import.meta.env.BASE_URL}${product.imageRef.replace(/^\/+/, '')}`}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          )}

          {isUnavailable && <span className="product-card__badge">Sold out</span>}
        </span>

        <span className="product-card__body">
          <span className="product-card__name">{product.name}</span>
          <span className="product-card__description">{product.description}</span>
          <span className="product-card__price">
            {priceFormatter.format(product.price)}
          </span>
        </span>
      </button>
    </article>
  )
}

export default ProductCard