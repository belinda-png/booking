import { useEffect, useState } from 'react'
import AuthPage from './components/AuthPage.jsx'
import app from "./firebase";
function App() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash
    return ['#stays', '#register', '#signin'].includes(hash) ? hash : '#home'
  })

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash
      setRoute(['#stays', '#register', '#signin'].includes(hash) ? hash : '#home')
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const isStays = route === '#stays'
  const isRegister = route === '#register'
  const isSignin = route === '#signin'
  const handleNavClick = (hash) => (event) => {
    event.preventDefault()
    window.location.hash = hash
  }

  const renderHome = () => (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Find your next stay</span>
          <h1>Search deals on hotels, homes, and much more...</h1>
          <p className="hero-intro">
            Search the best Uganda destinations with flexible dates, trusted reviews, and local travel insights.
          </p>

          <form className="search-form" aria-label="Booking search form">
            <div className="search-field">
              <label>Where are you going?</label>
              <input type="text" placeholder="Kampala, Entebbe, Mbarara..." />
            </div>
            <div className="search-field row">
              <div>
                <label>Check-in</label>
                <input type="date" />
              </div>
              <div>
                <label>Check-out</label>
                <input type="date" />
              </div>
            </div>
            <div className="search-field row">
              <div>
                <label>Guests</label>
                <select>
                  <option>2 adults · 0 children · 1 room</option>
                  <option>3 adults · 1 child · 1 room</option>
                  <option>4 adults · 2 children · 2 rooms</option>
                </select>
              </div>
              <button type="submit" className="search-button">Search</button>
            </div>
          </form>
        </div>

        <div className="hero-cards">
          <article className="hero-card">
            <h3>Book now, pay at the property</h3>
            <p>Flexible booking options with free cancellation on most rooms.</p>
          </article>
          <article className="hero-card">
            <h3>300M+ reviews</h3>
            <p>Read guest feedback from travelers just like you.</p>
          </article>
          <article className="hero-card">
            <h3>2+ million properties</h3>
            <p>Hotels, apartments, resorts and villas across Uganda and East Africa.</p>
          </article>
          <article className="hero-card">
            <h3>Trusted 24/7 customer support</h3>
            <p>Always here to help with your booking questions.</p>
          </article>
        </div>
      </section>

      <section id="stays" className="section-head">
        <div>
          <p className="section-eyebrow">Homes guests love</p>
          <h2>Popular stays in Uganda</h2>
        </div>
        <a href="#" className="view-all">View all</a>
      </section>

      <section className="property-grid">
        <a href="/property/acacia-villa-kampala" className="property-card featured">
          <div className="property-image image-1" />
          <div className="property-copy">
            <span className="badge">Genix</span>
            <h3>Acacia Villa Kampala</h3>
            <p>2.4 km from center · Starting from US$116</p>
          </div>
        </a>
        <a href="/property/da-white-residence" className="property-card">
          <div className="property-image image-2" />
          <div className="property-copy">
            <span className="badge">Genix</span>
            <h3>Da White Residence</h3>
            <p>3.1 km from center · Starting from US$127</p>
          </div>
        </a>
        <a href="/property/utopia-bay-bnb" className="property-card">
          <div className="property-image image-3" />
          <div className="property-copy">
            <span className="badge">Genix</span>
            <h3>Utopia Bay B&B</h3>
            <p>10.6 km from center · Starting from US$244</p>
          </div>
        </a>
        <a href="/property/kesho-luxury-apartment" className="property-card">
          <div className="property-image image-4" />
          <div className="property-copy">
            <span className="badge">Genix</span>
            <h3>Kesho Luxury Furnished Apartment</h3>
            <p>4.5 km from center · Starting from US$245</p>
          </div>
        </a>
      </section>

      <section className="section-head">
        <div>
          <p className="section-eyebrow">Trending destinations</p>
          <h2>Most popular choices for travelers from Uganda</h2>
        </div>
      </section>

      <section className="destination-grid">
        <a href="/destination/kampala" className="destination-card dest-1">
          <span>Kampala</span>
        </a>
        <a href="/destination/nairobi" className="destination-card dest-2">
          <span>Nairobi</span>
        </a>
        <a href="/destination/entebbe" className="destination-card dest-3">
          <span>Entebbe</span>
        </a>
        <a href="/destination/kigali" className="destination-card dest-4">
          <span>Kigali</span>
        </a>
        <a href="/destination/cape-town" className="destination-card dest-5">
          <span>Cape Town</span>
        </a>
      </section>

      <section className="section-head">
        <div>
          <p className="section-eyebrow">Quick and easy trip planner</p>
          <h2>Pick a vibe and explore top destinations in Uganda</h2>
        </div>
      </section>

      <section className="trip-planner">
        <button className="pill active">Birdwatching & Nature</button>
        <button className="pill">Volunteer Trips</button>
        <button className="pill">Adventure Getaways</button>
        <button className="pill">Hiking Adventures</button>
        <button className="pill">Historical Tours</button>
        <button className="pill">Wildlife Safari</button>
      </section>

      <section className="section-head">
        <div>
          <p className="section-eyebrow">Browse by property type</p>
          <h2>Discover stays by the experience you want</h2>
        </div>
      </section>

      <section className="property-type-grid">
        <a href="/property-type/hotels" className="property-type-card type-1">
          <h3>Hotels</h3>
          <p>Comfortable stays in the heart of town.</p>
        </a>
        <a href="/property-type/apartments" className="property-type-card type-2">
          <h3>Apartments</h3>
          <p>Homey spaces for longer stays.</p>
        </a>
        <a href="/property-type/resorts" className="property-type-card type-3">
          <h3>Resorts</h3>
          <p>Relaxing escapes with all amenities.</p>
        </a>
        <a href="/property-type/villas" className="property-type-card type-4">
          <h3>Villas</h3>
          <p>Private living for family and friends.</p>
        </a>
      </section>

      <section className="travel-savings-card">
        <div>
          <p className="section-eyebrow">Travel more, spend less</p>
          <h2>Sign in for Genius deals and member savings</h2>
          <p>Save 10% or more at participating properties — just look for the blue Genius label.</p>
          <div className="travel-actions">
            <a href="#signin" className="solid-button" onClick={handleNavClick('#signin')}>Sign in</a>
            <a href="#register" className="ghost-button" onClick={handleNavClick('#register')}>Register</a>
          </div>
        </div>
        <div className="travel-tag">Genius</div>
      </section>

      <section className="section-head">
        <div>
          <p className="section-eyebrow">Popular with travelers from Uganda</p>
          <h2>Browse the most-loved categories</h2>
        </div>
      </section>

      <section className="popular-tags">
        <button className="pill active">Domestic cities</button>
        <button className="pill">International cities</button>
        <button className="pill">Regions</button>
        <button className="pill">Countries</button>
        <button className="pill">Places to stay</button>
      </section>

      <section className="small-card-row">
        <a href="/destination/kampala" className="small-card small-card-1">
          <h3>Kampala</h3>
          <p>1.4 km away · 2,302 properties</p>
        </a>
        <a href="/destination/entebbe" className="small-card small-card-2">
          <h3>Entebbe</h3>
          <p>21 km away · 315 properties</p>
        </a>
        <a href="/destination/mbarara" className="small-card small-card-3">
          <h3>Mbarara</h3>
          <p>227 km away · 62 properties</p>
        </a>
        <a href="/destination/fort-portal" className="small-card small-card-4">
          <h3>Fort Portal</h3>
          <p>256 km away · 92 properties</p>
        </a>
        <a href="/destination/gulu" className="small-card small-card-5">
          <h3>Gulu</h3>
          <p>274 km away · 43 properties</p>
        </a>
        <a href="/destination/kabale" className="small-card small-card-6">
          <h3>Kabale</h3>
          <p>336 km away · 49 properties</p>
        </a>
      </section>
    </>
  )

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-row">
          <div className="brand brand-logo">
            <strong>Booking.com</strong>
          </div>

          <div className="utility-right">
            <button className="utility-pill">USD</button>
            <button className="utility-pill with-flag" aria-label="United States">🇺🇸</button>
            <button className="utility-icon" aria-label="Help">?</button>
            <a href="#" className="list-property">List your property</a>
            <a href="#register" className="ghost-button" onClick={handleNavClick('#register')}>Register</a>
            <a href="#signin" className="solid-button" onClick={handleNavClick('#signin')}>Sign in</a>
          </div>
        </div>

        <nav className="topnav">
          <a
            href="#stays"
            className={isStays ? 'selected' : ''}
            onClick={handleNavClick('#stays')}
          >
            <span className="nav-icon">🛏</span> Stays
          </a>
          <a href="#" onClick={handleNavClick('#home')}>
            <span className="nav-icon">✈️</span> Flights
          </a>
          <a href="#" onClick={handleNavClick('#home')}>
            <span className="nav-icon">🚗</span> Car rental
          </a>
          <a href="#" onClick={handleNavClick('#home')}>
            <span className="nav-icon">🎡</span> Attractions
          </a>
          <a href="#" onClick={handleNavClick('#home')}>
            <span className="nav-icon">🚕</span> Airport taxis
          </a>
        </nav>
      </header>

      {isRegister || isSignin ? (
        <AuthPage mode={isRegister ? 'register' : 'signin'} onNavigate={(hash) => { window.location.hash = hash }} />
      ) : (
        <main>{renderHome()}</main>
      )}
    </div>
  )
}

export default App