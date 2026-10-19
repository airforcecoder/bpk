import './HomePage.css'

function HomePage() {
  return (
    <main className="home">
      {/* BPK-36: Promo banner goes here */}

      {/* Hero carousel */}
      <section className="home__hero"></section>

      {/* Pick Your Size */}
      <section className="page-container home__section">
        <h2 className="home__section-title">Pick Your Size</h2>
      </section>

      {/* Our Flavors */}
      <section className="page-container home__section">
        <h2 className="home__section-title">Our Flavors</h2>
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
