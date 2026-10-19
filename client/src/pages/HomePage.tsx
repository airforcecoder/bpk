import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './HomePage.css'

/* Placeholder data, swap with real content later */

type Slide = {
  headline: string
  text: string
}

const slides: Slide[] = [
  { headline: 'Fresh Pudding Daily', text: 'Placeholder text about our classic banana pudding.' },
  { headline: 'Seasonal Flavor Here', text: 'Placeholder text about a limited time flavor.' },
  { headline: 'Party Trays Available', text: 'Placeholder text about ordering for events.' },
]

type Size = {
  name: string
  description: string
}

const sizes: Size[] = [
  { name: 'Family Size', description: 'Placeholder, serves a crowd.' },
  { name: 'Single Cup', description: 'Placeholder, one person treat.' },
  { name: 'Mini Pack', description: 'Placeholder, bite-sized by the dozen.' },
]

type FlavorCategory = 'Classic' | 'Seasonal' | 'Specials'
type FlavorFilter = 'All' | FlavorCategory

type Flavor = {
  name: string
  category: FlavorCategory
}

const flavorFilters: FlavorFilter[] = ['All', 'Classic', 'Seasonal', 'Specials']

const flavors: Flavor[] = [
  { name: 'Flavor One', category: 'Classic' },
  { name: 'Flavor Two', category: 'Classic' },
  { name: 'Flavor Three', category: 'Classic' },
  { name: 'Flavor Four', category: 'Seasonal' },
  { name: 'Flavor Five', category: 'Seasonal' },
  { name: 'Flavor Six', category: 'Specials' },
  { name: 'Flavor Seven', category: 'Specials' },
  { name: 'Flavor Eight', category: 'Specials' },
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
          {visibleFlavors.map((flavor) => (
            <article key={flavor.name} className="home__flavor-card">
              <div className="home__placeholder home__flavor-image">Image</div>
              <h3 className="home__flavor-name">{flavor.name}</h3>
            </article>
          ))}
        </div>
      </section>

      {/* Order Your Way */}
      <section className="page-container home__section">
        <h2 className="home__section-title">Order Your Way</h2>
      </section>

      {/* BPK-37: Business info (hours, location, social links) goes here */}
    </main>
  )
}

export default HomePage
