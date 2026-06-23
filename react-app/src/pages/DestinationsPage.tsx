import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CITIES,
  findDealsForCityName,
  getCitiesGrouped,
  type City,
} from "../data/destinations";
import { useDestinations } from "../contexts/destinationsContext";
import "./DestinationsPage.css";

const CONTINENT_EMOJI: Record<string, string> = {
  Asia: "🌏",
  "Middle East": "🕌",
  Europe: "🏰",
  Americas: "🗽",
  Africa: "🦁",
  Oceania: "🏝",
};

export function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCity = searchParams.get("city");

  const groups = useMemo(() => getCitiesGrouped(), []);
  const [openContinents, setOpenContinents] = useState<Set<string>>(
    () => new Set(groups.map((g) => g.continent))
  );
  const [activeTab, setActiveTab] = useState<string>(
    groups[0]?.continent ?? ""
  );
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const toggleContinent = (continent: string) =>
    setOpenContinents((prev) => {
      const next = new Set(prev);
      if (next.has(continent)) next.delete(continent);
      else next.add(continent);
      return next;
    });

  const jumpToContinent = (continent: string) => {
    setOpenContinents((prev) => {
      const next = new Set(prev);
      next.add(continent);
      return next;
    });
    setActiveTab(continent);
    const el = sectionRefs.current[continent];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleCityClick = (city: City) => {
    setSearchParams({ city: city.name });
  };

  const handleClearCity = () => {
    setSearchParams({});
  };

  useEffect(() => {
    if (selectedCity) window.scrollTo({ top: 0, behavior: "auto" });
  }, [selectedCity]);

  // Filtered deals view
  if (selectedCity) {
    return (
      <FilteredDealsView
        cityName={selectedCity}
        onBack={handleClearCity}
      />
    );
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80"
            alt="World destinations"
          />
        </div>
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Destinations</span>
          </div>
          <h1 className="page-hero-title">Explore the World</h1>
          <p className="page-hero-sub">
            Browse cities by continent and country — tap any city to see every deal
            we currently run there.
          </p>
        </div>
      </div>

      {/* Sticky continent tab bar */}
      <div className="dp-continent-tabs">
        <div className="dp-continent-tabs-inner">
          {groups.map((g) => (
            <button
              type="button"
              key={g.continent}
              className={`dp-cont-tab ${activeTab === g.continent ? "active" : ""}`}
              onClick={() => jumpToContinent(g.continent)}
            >
              <span className="dp-cont-tab-emoji" aria-hidden="true">
                {CONTINENT_EMOJI[g.continent] ?? "🌍"}
              </span>
              {g.continent}
              <span className="dp-cont-tab-count">{g.totalCities}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dp-explorer">
        {groups.map((g) => {
          const open = openContinents.has(g.continent);
          return (
            <section
              key={g.continent}
              ref={(el) => {
                sectionRefs.current[g.continent] = el;
              }}
              className={`dp-continent ${open ? "open" : ""}`}
              id={`continent-${g.continent.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <button
                type="button"
                className="dp-continent-head"
                aria-expanded={open}
                onClick={() => toggleContinent(g.continent)}
              >
                <div className="dp-continent-head-left">
                  <span className="dp-continent-emoji" aria-hidden="true">
                    {CONTINENT_EMOJI[g.continent] ?? "🌍"}
                  </span>
                  <div>
                    <h2 className="dp-continent-title">{g.continent}</h2>
                    <p className="dp-continent-meta">
                      {g.countries.length}{" "}
                      {g.countries.length === 1 ? "country" : "countries"} ·{" "}
                      {g.totalCities}{" "}
                      {g.totalCities === 1 ? "city" : "cities"}
                    </p>
                  </div>
                </div>
                <span
                  className={`dp-chevron ${open ? "open" : ""}`}
                  aria-hidden="true"
                >
                  ⌃
                </span>
              </button>

              <div className="dp-continent-body" aria-hidden={!open}>
                <div className="dp-continent-body-inner">
                  {g.countries.map((c) => (
                    <div className="dp-country" key={c.country}>
                      <div className="dp-country-head">
                        <h3 className="dp-country-name">{c.country}</h3>
                        <span className="dp-country-line" aria-hidden="true"></span>
                        <span className="dp-country-count">
                          {c.cities.length}{" "}
                          {c.cities.length === 1 ? "city" : "cities"}
                        </span>
                      </div>
                      <div className="dp-city-grid">
                        {c.cities.map((city) => (
                          <button
                            type="button"
                            key={`${city.country}-${city.name}`}
                            className="dp-city-card"
                            onClick={() => handleCityClick(city)}
                          >
                            <div className="dp-city-img">
                              <img
                                src={city.image}
                                alt={city.name}
                                loading="lazy"
                                onLoad={(e) =>
                                  e.currentTarget.classList.add("loaded")
                                }
                              />
                              <div className="dp-city-img-overlay"></div>
                              <div className="dp-city-img-label">
                                <div className="dp-city-country">
                                  {city.country}
                                </div>
                                <div className="dp-city-name">{city.name}</div>
                              </div>
                            </div>
                            <div className="dp-city-body">
                              <p className="dp-city-tagline">{city.tagline}</p>
                              <span className="dp-city-cta">
                                See deals →
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

/* ─── Filtered deals view (in-page) ─────────────────────────────── */

function FilteredDealsView({
  cityName,
  onBack,
}: {
  cityName: string;
  onBack: () => void;
}) {
  const { destinations } = useDestinations();
  const deals = useMemo(
    () => findDealsForCityName(destinations, cityName),
    [destinations, cityName],
  );
  const cityMeta = CITIES.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );
  const heroImage =
    cityMeta?.image ??
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80";

  return (
    <>
      <div className="page-hero dp-filtered-hero">
        <div className="page-hero-bg">
          <img src={heroImage} alt={cityName} />
        </div>
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/destinations">Destinations</Link>
            <span className="sep">/</span>
            <span>{cityName}</span>
          </div>
          <h1 className="page-hero-title">
            Deals including <em>"{cityName}"</em>
          </h1>
          <p className="page-hero-sub">
            {deals.length === 0
              ? "Nothing matched just yet — our specialists can craft a custom itinerary."
              : `${deals.length} curated ${
                  deals.length === 1 ? "package" : "packages"
                } mentioning ${cityName}.`}
          </p>
          <button
            type="button"
            className="dp-back-btn"
            onClick={onBack}
          >
            ← Back to all destinations
          </button>
        </div>
      </div>

      <div className="dp-filtered-body">
        {deals.length === 0 ? (
          <div className="dp-empty-state">
            <div className="dp-empty-icon" aria-hidden="true">🧭</div>
            <h2>No deals found for this destination yet.</h2>
            <p>Check back soon — we add new journeys every season.</p>
            <div className="dp-empty-actions">
              <button type="button" className="btn btn-gold" onClick={onBack}>
                Browse other destinations
              </button>
              <Link to="/contact#inquiry-section" className="btn btn-outline-navy">
                Speak to a specialist
              </Link>
            </div>
          </div>
        ) : (
          <div className="dp-deals-grid">
            {deals.map((d) => {
              const pricing = d.pricing ?? [];
              return (
                <Link
                  to={`/destinations/${d.slug}`}
                  key={d.slug}
                  className="dp-deal-card bestseller"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card-img">
                    <img src={d.image} alt={d.name} />
                    <div className="img-overlay"></div>
                    <div className="img-dest-name">
                      <div className="img-region">{d.regionLabel}</div>
                      {d.name}
                    </div>
                    <div className="card-labels">
                      {d.badge && (
                        <span className="lbl lbl-bestseller">{d.badge}</span>
                      )}
                    </div>
                    <div className="save-tag">From {d.fromPrice}</div>
                  </div>
                  <div className="card-body">
                    <div className="card-rating">
                      <span className="c-stars">{d.rating}</span>
                      <span className="c-rating-txt">{d.ratingText}</span>
                    </div>
                    <div className="card-title">{d.name}</div>
                    <div className="card-highlights">
                      {d.metaItems.slice(0, 3).map((mi, i) => (
                        <span key={i} className="c-hl">
                          <strong>{mi.strong}</strong>&nbsp;{mi.rest}
                        </span>
                      ))}
                    </div>
                    <div className="card-pills">
                      {d.tags.map((t, i) => (
                        <span key={i} className="c-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                    {pricing.length > 0 && (
                      <div className="dp-month-pills">
                        {pricing.map((p) => (
                          <span key={p.month} className="dp-month-pill">
                            {p.month} · {p.display}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="card-pricing">
                      <div className="price-block">
                        <span className="price-per">From per person</span>
                        <div className="price-now">{d.fromPrice}</div>
                      </div>
                      <div className="price-meta">
                        <span className="saving-pill">
                          {d.pricing
                            ? `${d.pricing.length} months`
                            : `${d.packages?.length ?? 0} packages`}
                        </span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <span className="btn-primary">View Package →</span>
                      <span className="btn-secondary">Enquire</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
