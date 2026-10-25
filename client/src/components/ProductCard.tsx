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

/* Falls back to readable text when data is missing, so one bad product never breaks the page */
function formatPrice(price: unknown): string {
  return typeof price === 'number' && Number.isFinite(price)
    ? priceFormatter.format(price)
    : 'Price unavailable'
}

function getAvailability(availability: unknown): { label: string; modifier: string } {
  if (availability === 'available') {
    return { label: 'Available', modifier: 'available' }
  }
  if (availability === 'unavailable') {
    return { label: 'Unavailable', modifier: 'unavailable' }
  }
  return { label: 'Check availability', modifier: 'unknown' }
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  const name = product.name?.trim() || 'Unnamed item'
  const imageRef = product.imageRef?.trim()
  const showImage = Boolean(imageRef) && !imageFailed
  const availability = getAvailability(product.availability)

  return (
    <article
      className={`product-card${availability.modifier === 'unavailable' ? ' product-card--unavailable' : ''
        }`}
    >
      <button
        type="button"
        className="product-card__button"
        onClick={() => onSelect?.(product)}
      >
        <span className="product-card__media">
          {showImage ? (
            <img
              className="product-card__image"
              src={`${import.meta.env.BASE_URL}${imageRef!.replace(/^\/+/, '')}`}
              alt={name}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="product-card__placeholder" aria-hidden="true">
              <span className="product-card__placeholder-icon">🍮</span>
              <span>{name}</span>
            </span>
          )}
        </span>

        <span className="product-card__body">
          <span className="product-card__name">{name}</span>

          {product.description && (
            <span className="product-card__description">{product.description}</span>
          )}

          <span className="product-card__footer">
            <span className="product-card__price">{formatPrice(product.price)}</span>
            <span
              className={`product-card__availability product-card__availability--${availability.modifier}`}
            >
              {availability.label}
            </span>
          </span>
        </span>
      </button>
    </article>
  )
}

export default ProductCard