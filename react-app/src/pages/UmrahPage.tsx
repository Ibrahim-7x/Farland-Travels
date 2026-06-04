import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UMRAH_CITIES,
  getUmrahFromPrice,
  getUmrahPackageCount,
} from "../data/umrah";
import "./DealsPage.css";
import "./UmrahPage.css";

export function UmrahPage() {
  const { hash } = useLocation();
  const fromPrice = getUmrahFromPrice();
  const totalPackages = getUmrahPackageCount();

  // Deep-link support for the nav dropdown's per-city anchors (/umrah#perth)
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [hash]);

  return (
    <>
      {/* HERO */}
      <div className="dp-page-hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1600&q=85"
            alt="Umrah pilgrimage"
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="dp-breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Umrah</span>
          </div>
          <div className="dp-hero-eyebrow">September departures</div>
          <h1 className="dp-hero-title">
            Umrah Packages,
            <br />
            <em>Fully Priced</em>
          </h1>
          <p className="dp-hero-sub">
            Curated Umrah packages departing from Perth, Melbourne, and Sydney —
            five-star and 5/4-star hotels steps from the Haram and Masjid
            al-Nabawi. Choose your departure city and book direct with our
            specialists.
          </p>
          <div className="dp-hero-meta-row">
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>
              <strong>{totalPackages}</strong> curated packages
            </div>
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>From <strong>{fromPrice}</strong>
            </div>
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>
              <strong>3</strong> departure cities
            </div>
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>
              <strong>Quad</strong> occupancy
            </div>
          </div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div className="trust-strip">
        <div className="trust-inner">
          <div className="trust-item">
            <span className="trust-icon">🕋</span>
            <div>
              <strong>Steps from the Haram</strong>Walking distance to the Holy
              Mosque
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🕌</span>
            <div>
              <strong>Close to Masjid al-Nabawi</strong>Madinah hotels nearby
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">👨‍👩‍👧</span>
            <div>
              <strong>Family-friendly</strong>All prices based on Quad rooms
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🚌</span>
            <div>
              <strong>Transfers included</strong>Group transfers Makkah ↔ Madinah
            </div>
          </div>
        </div>
      </div>

      {/* PACKAGES BY DEPARTURE CITY */}
      <div className="um-page-body">
        {UMRAH_CITIES.map((city) => (
          <section key={city.id} id={city.id} className="um-city">
            <div className="um-city-head">
              <h2 className="um-city-title">From {city.city}</h2>
              <span className="um-city-meta">
                {city.packages.length} packages · September departures
              </span>
            </div>
            <div className="um-grid">
              {city.packages.map((pkg) => (
                <div key={pkg.id} className="um-card">
                  <div className="um-card-top">
                    <span className="um-stars">{pkg.stars}</span>
                    <div className="um-price">
                      <small>from</small>
                      {pkg.priceDisplay}
                    </div>
                  </div>
                  <div className="um-card-pills">
                    <span className="um-pill">{pkg.nights}</span>
                    <span className="um-pill">{pkg.roomType}</span>
                    <span className="um-pill">{pkg.month}</span>
                  </div>
                  <div className="um-hotels">
                    <div className="um-hotel">
                      <span className="um-hotel-city">🕋 Makkah</span>
                      <span className="um-hotel-name">{pkg.makkahHotel}</span>
                      <span className="um-hotel-nights">{pkg.makkahNights}</span>
                    </div>
                    <div className="um-hotel">
                      <span className="um-hotel-city">🕌 Madinah</span>
                      <span className="um-hotel-name">{pkg.madinahHotel}</span>
                      <span className="um-hotel-nights">{pkg.madinahNights}</span>
                    </div>
                  </div>
                  <div className="um-card-actions">
                    <Link to="/contact#inquiry-section" className="btn-primary">
                      Enquire →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* NEWSLETTER */}
      <div className="nl-section">
        <div className="nl-inner">
          <div className="nl-eyebrow">Plan your sacred journey</div>
          <h2 className="nl-title">Speak to an Umrah Specialist</h2>
          <p className="nl-sub">
            Our team will tailor your dates, hotels, and occupancy — and hold
            your price while you decide.
          </p>
          <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
            <input
              className="nl-input"
              type="email"
              placeholder="Enter your email address"
            />
            <button type="submit">Get in touch ↗</button>
          </form>
        </div>
      </div>
    </>
  );
}
