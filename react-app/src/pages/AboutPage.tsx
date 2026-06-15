import { Link } from "react-router-dom";
import "./AboutPage.css";

export function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="about-hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80"
            alt="Farland travel team"
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </div>
          <h1 className="hero-title">Crafting Journeys With Purpose</h1>
          <p className="hero-sub">
            Farland Holidays is a boutique luxury travel company designing bespoke
            journeys for curious travelers. We combine deep destination knowledge,
            trusted partners, and a human-first service culture.
          </p>
          <div className="hero-actions">
            <Link to="/contact#inquiry-section" className="btn btn-gold">
              Start Planning
            </Link>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="about-section reveal">
        <div className="about-container">
          <div className="section-eyebrow">Who We Are</div>
          <h2 className="section-title">A Travel Studio Built On Trust</h2>
          <p className="section-sub">
            We started Farland to build the kind of travel company we wished
            existed. A partner who listens carefully, designs intelligently, and stays by
            your side from the first call to your return home.
          </p>

          <div className="story-grid">
            <div className="story-card">
              <p>
                Our specialists are destination obsessives. Every itinerary is built
                around what matters most to you: time, comfort, authenticity, and the
                little details that transform a trip into a memory.
              </p>
              <p>
                We work with hand-picked hotels, guides, and private experiences that
                reflect our standards. That means fewer options, but better outcomes for
                every traveler.
              </p>
              <div className="story-stats">
                <div className="stat-tile">
                  <strong>Worldwide</strong>
                  <span>Destinations</span>
                </div>
                <div className="stat-tile">
                  <strong>Memorable</strong>
                  <span>Journeys</span>
                </div>
                <div className="stat-tile">
                  <strong>Highly rated</strong>
                  <span>Service</span>
                </div>
              </div>
            </div>
            <div className="story-img">
              <img
                src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=900&q=80"
                alt="Farland concierge"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section
        className="about-section reveal"
        style={{ background: "var(--ivory-mid)" }}
      >
        <div className="about-container">
          <div className="section-eyebrow">What We Believe</div>
          <h2 className="section-title">Our Values Shape Every Itinerary</h2>
          <p className="section-sub">
            We are a tour operator first and a travel agency second. These six
            principles guide how we design routes, choose partners, and look after
            you on the road.
          </p>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">01</div>
              <h4>Tailor-Made, Never Templated</h4>
              <p>
                No two travellers want the same trip. Every itinerary is built from
                scratch around your pace, interests, and bucket-list moments — not
                pulled from a brochure.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">02</div>
              <h4>Destination Expertise</h4>
              <p>
                Our specialists have lived in or repeatedly travelled to the regions
                they design — Singapore, Bali, Dubai, and the Holy Cities included.
                You get first-hand knowledge, not a desk search.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">03</div>
              <h4>Hand-Picked Partners</h4>
              <p>
                Hotels, private guides, and ground operators are personally vetted.
                If we wouldn't book it for our own family, it doesn't make our
                itineraries.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">04</div>
              <h4>Dedicated Support</h4>
              <p>
                From your first enquiry to your return home, a real specialist
                looks after the details of your trip.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">05</div>
              <h4>Responsible Travel</h4>
              <p>
                We choose partners who respect local communities and the
                places we love, so they are looked after for the future.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">06</div>
              <h4>24/7 On-Trip Support</h4>
              <p>
                One number, day or night, wherever you are in the world. Missed
                connection, changed plans, or just a question — a real human
                specialist is one call away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="stats-band reveal">
        <div className="stats-inner">
          <div className="stats-card">
            <strong>Trusted</strong>
            <span>by repeat clients</span>
          </div>
          <div className="stats-card">
            <strong>24/7</strong>
            <span>Trip support</span>
          </div>
          <div className="stats-card">
            <strong>Hand-picked</strong>
            <span>hotel partners</span>
          </div>
          <div className="stats-card">
            <strong>Senior</strong>
            <span>travel specialists</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta reveal">
        <div className="about-cta-inner">
          <h2 className="about-cta-title">Ready to design your next journey?</h2>
          <p className="about-cta-sub">
            Tell us where you want to go. We will handle the details, the logistics, and
            the special touches that make a trip unforgettable.
          </p>
          <div className="about-cta-actions">
            <Link to="/contact#inquiry-section" className="btn btn-gold">
              Plan My Trip
            </Link>
            <Link to="/destinations" className="btn btn-outline-white">
              Browse Destinations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
