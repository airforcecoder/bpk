import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './HomePage.css'
import PromoBanner from '../components/promoBanner'

/* BPK-117: Home page content. Sizes and prices match mockProducts.ts, promos match promoBanner.ts.
   OG Nilla is the only confirmed flavor so far, other flavors show as Coming Soon until Kendra approves them. */

type Slide = {
  headline: string
  text: string
}

const slides: Slide[] = [
  { headline: 'Meet OG Nilla', text: 'Our classic banana pudding, made the original way.' },
  { headline: '$10 Tuesdays', text: 'Swing by on Tuesdays for our $10 deal, and get $4 off selfies.' },
  { headline: 'Party Pans Available', text: 'Feeding a crowd? Party pans and 3oz party cups are ready to order.' },
]

type Size = {
  name: string
  description: string
}

const sizes: Size[] = [
  { name: 'Mini & Selfie', description: '8oz and 16oz cups, starting at $8.' },
  { name: 'Party Cups', description: 'A dozen 3oz cups for $36.' },
  { name: 'Pans', description: 'Usie, Family, Party and Party Plus pans, from $30.' },
]

type FlavorCategory = 'Classic' | 'Seasonal' | 'Specials'
type FlavorFilter = 'All' | FlavorCategory

type Flavor = {
  name: string
  category: FlavorCategory
  comingSoon?: boolean
}

const flavorFilters: FlavorFilter[] = ['All', 'Classic', 'Seasonal', 'Specials']

/* comingSoon = temporary card, replace once the real flavor is approved */
const flavors: Flavor[] = [
  { name: 'OG Nilla', category: 'Classic' },
  { name: 'Coming Soon', category: 'Classic', comingSoon: true },
  { name: 'Coming Soon', category: 'Seasonal', comingSoon: true },
  { name: 'Coming Soon', category: 'Specials', comingSoon: true },
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

const SLIDE_INTERVAL_MS = 5000

function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeFilter, setActiveFilter] = useState<FlavorFilter>('All')

  const visibleFlavors =
    activeFilter === 'All' ? flavors : flavors.filter((flavor) => flavor.category === activeFilter)

  /* Auto-rotate, timer restarts whenever the slide changes so manual clicks get a full 5s */
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [activeSlide])

  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length)

  return (
    <main className="home">
      {/* BPK-36: Promo banner goes here */}
      <PromoBanner />

      {/* Hero carousel */}
      <section className="home__hero" aria-roledescription="carousel">
        {slides.map((slide, index) => (
          <div
            key={slide.headline}
            className={index === activeSlide ? 'home__slide home__slide--active' : 'home__slide'}
            aria-hidden={index !== activeSlide}
          >
            <div className="home__placeholder home__slide-image">Image</div>
            <div className="home__slide-content">
              <h1 className="home__slide-headline">{slide.headline}</h1>
              <p className="home__slide-text">{slide.text}</p>
              <Link
                to="/order"
                className="btn btn-primary home__btn"
                tabIndex={index === activeSlide ? 0 : -1}
              >
                Order Now
              </Link>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="home__arrow home__arrow--prev"
          aria-label="Previous slide"
          onClick={prevSlide}
        >
          ‹
        </button>
        <button
          type="button"
          className="home__arrow home__arrow--next"
          aria-label="Next slide"
          onClick={nextSlide}
        >
          ›
        </button>

        <div className="home__dots">
          {slides.map((slide, index) => (
            <button
              key={slide.headline}
              type="button"
              className={index === activeSlide ? 'home__dot home__dot--active' : 'home__dot'}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeSlide}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Pick Your Size */}
      <section className="page-container home__section">
        <h2 className="home__section-title">Pick Your Size</h2>
        <div className="home__sizes">
          {sizes.map((size) => (
            <article key={size.name} className="home__size-card">
              <div className="home__placeholder home__size-image">Image</div>
              <h3 className="home__size-name">{size.name}</h3>
              <p className="home__size-text">{size.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Our Flavors */}
      <section className="page-container home__section">
        <h2 className="home__section-title">Our Flavors</h2>
        <div className="home__pills">
          {flavorFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={filter === activeFilter ? 'home__pill home__pill--active' : 'home__pill'}
              aria-pressed={filter === activeFilter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="home__flavors">
          {visibleFlavors.map((flavor, index) => (
            <article key={`${flavor.category}-${index}`} className="home__flavor-card">
              <div className="home__placeholder home__flavor-image">
                {flavor.comingSoon ? 'More flavors coming' : 'Image'}
              </div>
              <h3 className="home__flavor-name">{flavor.name}</h3>
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
    </main>
  )
}

export default HomePage