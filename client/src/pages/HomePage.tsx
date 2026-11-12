import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './HomePage.css'
import PromoBanner from '../components/promoBanner'

/* BPK-100 imports for homepage menu slideshow display  */
import ProductDetailsModal from '../components/ProductDetailsModal'
import {getProducts} from '../services/productService'
import type { Product } from '../data/mockProducts'



/* BPK-117: Home page content. Sizes and prices match mockProducts.ts, promos match promoBanner.ts.
   OG Nilla is the only confirmed flavor so far, other flavors show as Coming Soon until Kendra approves them. */

/* Removed old carousel slides to add a new homepage hero carousel with updated content */

// Removed sizes to add a two column monthly feature section
type MonthlyFeature = {
  title: string
  name: string
  description: string
  image: string
}

// Our columns
const monthlyFeatures: MonthlyFeature[] = [

  // Flavoor of the month
  { 
    title: 'Flavor of the Month',
    name: 'OG Nilla', 
    description: 'Our classic banana pudding, made the original way.',
    image: '/images/og-nilla.jpg'
   },

  // Item of the month
  { 
    title: 'Item of the Month',
    name: 'Oreo banana pudding', 
    description: 'Krazy good, oreos, pudding, banana, oreos ITS GREAT',
    image: '/images/oreo-pudding.jpg'
  },

]

type OrderOption = {
  title: string
  text: string
}

/* BPK-116: Banana Pudding Krazy is pickup only, no delivery */
const orderOptions: OrderOption[] = [
  { title: 'Order Ahead', text: 'Choose your flavors and sizes online before you head over.' },
  { title: 'Pick Up', text: 'Pickup only. Grab your order at your chosen pickup time.' },
  { title: 'Party Orders', text: 'Ordering for an event? Plan ahead with party pans and cups.' },
]

/* removed old slide variables for new homepage hero carousel with updated content */

function HomePage() {
/* removed old slide state for new homepage hero carousel with updated content */

  /* BPK-100: Homepage menu slideshow display. Fetch products from productService and display them in a carousel. */
  const [products, setProducts] = useState<Product[]>([])
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productLoading, setProductLoading] = useState(true)
  const [productError, setProductError] = useState(false)
  useEffect(() => {
    let isCurrent = true
    getProducts()
      .then((data) => {
        if (isCurrent) {setProducts(data)}
      })
      .catch(() => {
        if (isCurrent) {setProductError(true)}
      })
      .finally(() => {
        if (isCurrent) {setProductLoading(false)}
      })

      return () => {
        isCurrent = false
      } 
  }, [])


  return (
    <main className="home">
      {/* BPK-36: Promo banner goes here */}
      <PromoBanner />

     {/* BPK-100: Homepage menu slideshow */}
      <section className="page-container home__section">
        <h2 className="home__section-title">Menu</h2>

        {productLoading && <p>Loading products...</p>}

        {productError && (
          <p>Error loading products. Please try again later.</p>
        )}

        {!productLoading && !productError && products.length === 0 && (
          <p>No products available.</p>
        )}

        {!productLoading && !productError && products.length > 0 && (
        
        <div className="home__hero home__menu-hero">
  <div className="home__slide home__slide--active">

    <img
      className="home__slide-image"
      src={`${import.meta.env.BASE_URL}${products[featuredIndex].imageRef.replace(/^\/+/, '')}`}
      alt={products[featuredIndex].name}
    />

    <div className="home__slide-content">
      <h2 className="home__slide-headline">
        {products[featuredIndex].name}
      </h2>

      <p className="home__slide-text">
        {products[featuredIndex].description}
      </p>

      <p className="home__slide-text">
        From ${products[featuredIndex].price.toFixed(2)}
      </p>

      <button
        type="button"
        className="btn btn-primary home__btn"
        onClick={() => setSelectedProduct(products[featuredIndex])}
      >
        View Details
      </button>
    </div>
  </div>

  <button
    type="button"
    className="home__arrow home__arrow--prev"
    aria-label="Previous product"
    disabled={products.length <= 1}
    onClick={() =>
      setFeaturedIndex((current) =>
        (current - 1 + products.length) % products.length
      )
    }
  >
    ‹
  </button>

  <button
    type="button"
    className="home__arrow home__arrow--next"
    aria-label="Next product"
    disabled={products.length <= 1}
    onClick={() =>
      setFeaturedIndex((current) =>
        (current + 1) % products.length
      )
    }
  >
    ›
  </button>
</div>
        )}

        {!productLoading && !productError && products.length > 0 && (
          <p className="home__menu-counter">
            {featuredIndex + 1} of {products.length}
          </p>
        )}

      </section>

      {/* Removed pick your size section, added Krazy good stuff section */}
      <section className="page-container home__section">
        <h2 className="home__section-title">Krazy Good Stuff</h2>
        <div className="home__sizes">
          {monthlyFeatures.map((feature) => (
            <article key={feature.name} className="home__size-card">
              {/* ColumnHeader placement */}
              <h3 className="home__feature-title">
                {feature.title}
              </h3>
                {/* Image placement */}
              <img
                className="home__size-image"
                src={`${import.meta.env.BASE_URL}${feature.image.replace(/^\/+/, '')}`}
                alt={feature.name}
                loading="lazy"
              />
              <h3 className="home__feature-name">{feature.name}</h3>
              <p className="home__feature-description">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>


      {/* Order for Pickup */}
      <section className="page-container home__section">
        <div className="home__order">
          <h2 className="home__section-title home__order-title">Order for Pickup</h2>
          <div className="home__order-options">
            {orderOptions.map((option) => (
              <div key={option.title} className="home__order-option">
                <h3 className="home__order-option-title">{option.title}</h3>
                <p className="home__order-option-text">{option.text}</p>
              </div>
            ))}
          </div>
          <Link to="/order" className="btn btn-primary home__btn">
            Order Now
          </Link>
        </div>
      </section>

      {/* BPK-37: Business info (hours, location, social links) goes here */}

      {/* BPK-100: Product details modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  )
}

export default HomePage