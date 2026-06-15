import { useState } from "react";
import { Link } from "react-router-dom";
import { DESTINATIONS } from "../data/destinations";
import { SearchBar } from "../components/SearchBar";
import { Testimonials } from "../components/Testimonials";
import { useSiteSettings, telHref } from "../contexts/siteSettings";
import "./HomePage.css";

export function HomePage() {
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const { contactPhone } = useSiteSettings();
  const phoneLink = telHref(contactPhone);

  const toggleWish = (key: string) =>
    setWishlist((w) => ({ ...w, [key]: !w[key] }));

  const [featured, ...rest] = DESTINATIONS;
  const deals = DESTINATIONS;

  return (
    <>
      {/* HERO */}
      <section id="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
            alt="Luxury mountain landscape"
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-dot"></div>
            <span>
              {DESTINATIONS.length} curated journeys · fully costed
            </span>
          </div>
          <h1 className="hero-headline">
            The World's Most
            <br />
            <em>Extraordinary</em>
            <br />
            Journeys Await
          </h1>
          <p className="hero-sub">
            Bespoke luxury travel, crafted around you. Singapore &amp; Bali, Dubai,
            Bali long-stay, and sacred journeys to Makkah &amp; Madinah — all fully
            costed.
          </p>
          <div className="hero-btns">
            <a href="#destinations" className="btn btn-gold">
              Explore destinations ↗
            </a>
            <a href="#deals" className="btn btn-outline-white">
              View current deals
            </a>
          </div>
          <SearchBar variant="hero" />
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>Expert</strong>
            <small>team of specialists</small>
          </div>
          <div className="hero-stat">
            <strong>Tailored</strong>
            <small>itineraries, every time</small>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations">
        <div className="destinations-inner">
          <div className="destinations-header">
            <div>
              <h2 className="section-title">Curated Destinations</h2>
              <p className="section-sub">
                Hand-selected journeys, each fully costed and ready to book.
              </p>
            </div>
            <Link to="/destinations" className="btn-text-gold">
              View all destinations →
            </Link>
          </div>
          <div className="dest-grid">
            {featured && (
              <Link
                to={`/destinations/${featured.slug}`}
                className="dest-card featured reveal"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="dest-img">
                  <img src={featured.image} alt={featured.name} />
                  <div className="dest-overlay"></div>
                  <div className="dest-img-meta">
                    <div className="dest-region">{featured.regionLabel}</div>
                    <div className="dest-name">{featured.name}</div>
                  </div>
                  {featured.badge && (
                    <div className="dest-badge">
                      <span>{featured.badge}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label={`Wishlist ${featured.name}`}
                    className={`dest-wish ${wishlist[featured.slug] ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWish(featured.slug);
                    }}
                  >
                    {wishlist[featured.slug] ? "♥" : "♡"}
                  </button>
                </div>
                <div className="dest-body">
                  <p className="dest-desc">{featured.description}</p>
                  <div className="dest-footer">
                    <div className="dest-price">
                      <small>From per person</small>
                      <strong>{featured.fromPrice}</strong>
                    </div>
                    <div className="dest-tags">
                      {featured.tags.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {rest.map((d, i) => (
              <Link
                key={d.slug}
                to={`/destinations/${d.slug}`}
                className={`dest-card reveal reveal-delay-${i + 1}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="dest-img">
                  <img src={d.image} alt={d.name} />
                  <div className="dest-overlay"></div>
                  <div className="dest-img-meta">
                    <div className="dest-region">{d.regionLabel}</div>
                    <div className="dest-name">{d.name}</div>
                  </div>
                  {d.badge && (
                    <div className="dest-badge">
                      <span>{d.badge}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label={`Wishlist ${d.name}`}
                    className={`dest-wish ${wishlist[d.slug] ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWish(d.slug);
                    }}
                  >
                    {wishlist[d.slug] ? "♥" : "♡"}
                  </button>
                </div>
                <div className="dest-body">
                  <p className="dest-desc">{d.description}</p>
                  <div className="dest-footer">
                    <div className="dest-price">
                      <small>From per person</small>
                      <strong>{d.fromPrice}</strong>
                    </div>
                    <div className="dest-tags">
                      {d.tags.slice(0, 2).map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DEALS */}
      <section id="deals">
        <div className="deals-inner">
          <div className="deals-header">
            <div>
              <h2 className="section-title">Exceptional Deals</h2>
              <p className="section-sub" style={{ color: "rgba(255,255,255,.45)" }}>
                Live published prices on our signature journeys.
              </p>
            </div>
          </div>
          <div className="deals-grid">
            {deals.slice(0, 3).map((d, i) => (
              <Link
                key={d.slug}
                to={`/destinations/${d.slug}`}
                className={`deal-card reveal reveal-delay-${i}`}
                style={{ textDecoration: "none" }}
              >
                <div className="deal-img">
                  <img src={d.image} alt={d.name} />
                  <div className="deal-img-overlay"></div>
                  <div className="deal-save-tag">From {d.fromPrice}</div>
                  <div className="deal-type-tag">{d.tags[0]}</div>
                </div>
                <div className="deal-body">
                  <div className="deal-dest">{d.regionLabel}</div>
                  <div className="deal-title">{d.name}</div>
                  <div className="deal-includes">
                    {d.tags.slice(0, 3).map((t) => (
                      <span key={t} className="deal-include">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="deal-pricing">
                    <div className="deal-price-wrap">
                      <div>
                        <span className="deal-now">{d.fromPrice}</span>
                        <span className="deal-per"> pp</span>
                      </div>
                    </div>
                    <span className="deal-cta">View package →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why">
        <div className="why-inner">
          <div className="why-grid">
            <div className="why-img reveal">
              <div className="why-img-main">
                <img
                  src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80"
                  alt="Luxury hotel pool"
                />
              </div>
              <div className="why-img-accent">
                <img
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=300&q=80"
                  alt="Tropical beach"
                />
              </div>
              <div className="why-badge">
                <strong>Hands-on</strong>
                <span>destination expertise</span>
              </div>
            </div>
            <div className="reveal reveal-delay-2">
              <h2 className="section-title">
                Travel Shouldn't
                <br />
                Be Left to Chance
              </h2>
              <p className="section-sub">
                Every journey is researched, refined, and personalised by our destination
                specialists — people who've actually been there.
              </p>
              <div className="why-features">
                <div className="why-feature">
                  <div className="why-icon">✈</div>
                  <div className="why-feature-text">
                    <h4>Tailor-made only</h4>
                    <p>
                      Every itinerary is built around you — your pace, preferences, and
                      passions.
                    </p>
                  </div>
                </div>
                <div className="why-feature">
                  <div className="why-icon">🌍</div>
                  <div className="why-feature-text">
                    <h4>Expert specialists</h4>
                    <p>
                      Each destination expert has lived in or visited the places they
                      recommend.
                    </p>
                  </div>
                </div>
                <div className="why-feature">
                  <div className="why-icon">☎</div>
                  <div className="why-feature-text">
                    <h4>24/7 on-trip support</h4>
                    <p>A real human on the line, any hour.</p>
                  </div>
                </div>
                <div className="why-feature">
                  <div className="why-icon">🛡</div>
                  <div className="why-feature-text">
                    <h4>Trusted service</h4>
                    <p>Clear, honest pricing and a dedicated specialist from your first enquiry to your return home.</p>
                  </div>
                </div>
                <div className="why-feature">
                  <div className="why-icon">🌿</div>
                  <div className="why-feature-text">
                    <h4>Responsible travel</h4>
                    <p>
                      We work with partners who care for the destinations and
                      communities we visit.
                    </p>
                  </div>
                </div>
                <div className="why-feature">
                  <div className="why-icon">💰</div>
                  <div className="why-feature-text">
                    <h4>Competitive pricing</h4>
                    <p>Fair, transparent pricing with no hidden booking fees.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — only renders when there are published reviews */}
      <Testimonials />

      {/* CTA BANNER */}
      <section id="cta-banner">
        <div className="cta-bg">
          <div className="cta-bg-img">
            <img
              src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80"
              alt="Luxury travel destination"
            />
          </div>
          <div className="cta-overlay"></div>
          <div className="cta-content">
            <h2 className="section-title" style={{ fontSize: "clamp(34px,5vw,62px)" }}>
              Plan Your Dream
              <br />
              Holiday Today
            </h2>
            <p className="section-sub">
              Speak with one of our travel specialists. No obligation — just honest,
              expert advice and a plan built entirely around you.
            </p>
            <div className="cta-features">
              <span className="cta-feature">No booking fees</span>
              <span className="cta-feature">Competitive pricing</span>
              <span className="cta-feature">Expert consultation included</span>
              <span className="cta-feature">Trusted service</span>
            </div>
            <div className="cta-btns">
              <Link to="/contact#inquiry-section" className="btn btn-gold">
                Start planning your trip ↗
              </Link>
              {phoneLink ? (
                <a href={phoneLink} className="btn btn-outline-white">
                  ☎ Call {contactPhone}
                </a>
              ) : (
                <Link to="/contact#inquiry-section" className="btn btn-outline-white">
                  ☎ Call us
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
