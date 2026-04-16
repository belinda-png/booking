function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="logo-mark">BU</div>
          <div>
            <span className="brand-label">Booking Uganda</span>
            <strong>bookinguganda.com</strong>
          </div>
        </div>

        <nav className="topnav">
          <a href="#">Stays</a>
          <a href="#">Flights</a>
          <a href="#">Car rental</a>
          <a href="#">Attractions</a>
          <a href="#">Airport taxis</a>
        </nav>

        <div className="top-actions">
          <button className="ghost-button">Register</button>
          <button className="solid-button">Sign in</button>
        </div>
      </header>

      <main>
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

        <section className="section-head">
          <div>
            <p className="section-eyebrow">Homes guests love</p>
            <h2>Popular stays in Uganda</h2>
          </div>
          <a href="#" className="view-all">View all</a>
        </section>

        <section className="property-grid">
          <article className="property-card featured">
            <div className="property-image image-1" />
            <div className="property-copy">
              <span className="badge">Genix</span>
              <h3>Acacia Villa Kampala</h3>
              <p>2.4 km from center · Starting from US$116</p>
            </div>
          </article>
          <article className="property-card">
            <div className="property-image image-2" />
            <div className="property-copy">
              <span className="badge">Genix</span>
              <h3>Da White Residence</h3>
              <p>3.1 km from center · Starting from US$127</p>
            </div>
          </article>
          <article className="property-card">
            <div className="property-image image-3" />
            <div className="property-copy">
              <span className="badge">Genix</span>
              <h3>Utopia Bay B&B</h3>
              <p>10.6 km from center · Starting from US$244</p>
            </div>
          </article>
          <article className="property-card">
            <div className="property-image image-4" />
            <div className="property-copy">
              <span className="badge">Genix</span>
              <h3>Kesho Luxury Furnished Apartment</h3>
              <p>4.5 km from center · Starting from US$245</p>
            </div>
          </article>
        </section>

        <section className="section-head">
          <div>
            <p className="section-eyebrow">Trending destinations</p>
            <h2>Most popular choices for travelers from Uganda</h2>
          </div>
        </section>

        <section className="destination-grid">
          <article className="destination-card dest-1">
            <span>Kampala</span>
          </article>
          <article className="destination-card dest-2">
            <span>Nairobi</span>
          </article>
          <article className="destination-card dest-3">
            <span>Entebbe</span>
          </article>
          <article className="destination-card dest-4">
            <span>Kigali</span>
          </article>
          <article className="destination-card dest-5">
            <span>Cape Town</span>
          </article>
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

        <section className="small-card-row">
          <article className="small-card">
            <h3>Kampala</h3>
            <p>1.4 km away · 2,302 properties</p>
          </article>
          <article className="small-card">
            <h3>Entebbe</h3>
            <p>21 km away · 315 properties</p>
          </article>
          <article className="small-card">
            <h3>Mbarara</h3>
            <p>227 km away · 62 properties</p>
          </article>
          <article className="small-card">
            <h3>Fort Portal</h3>
            <p>256 km away · 92 properties</p>
          </article>
          <article className="small-card">
            <h3>Gulu</h3>
            <p>274 km away · 43 properties</p>
          </article>
          <article className="small-card">
            <h3>Kabale</h3>
            <p>336 km away · 49 properties</p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App