import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UMRAH_CITIES,
  UMRAH_EXCLUSIONS,
  UMRAH_TERMS,
  buildUmrahItinerary,
  getUmrahFromPrice,
  getUmrahPackageCount,
} from "../data/umrah";
import type { UmrahInclusion, UmrahPackage, UmrahTier } from "../data/umrah";
import "./DealsPage.css";
import "./UmrahPage.css";

const DEFAULT_CITY_ID = UMRAH_CITIES[0]?.id ?? "perth";

/** Maps a location hash ("#perth") to a known departure-city id, or null. */
function cityIdFromHash(hash: string): string | null {
  const id = hash.slice(1);
  return UMRAH_CITIES.some((c) => c.id === id) ? id : null;
}

const INCLUSION_META: Record<UmrahInclusion, { icon: string; label: string }> =
  {
    visa: { icon: "🛂", label: "Umrah visa" },
    flights: { icon: "✈️", label: "Return flights" },
    transfers: { icon: "🚌", label: "All transfers" },
    breakfast: { icon: "🍳", label: "Daily breakfast" },
    ziyarah: { icon: "🕌", label: "Ziyarah tours" },
    guide: { icon: "👥", label: "Guided group" },
  };

const TIER_CLASS: Record<UmrahTier, string> = {
  Economy: "um-tier-economy",
  Premium: "um-tier-premium",
  VIP: "um-tier-vip",
};

/** "10 nights — 6 Makkah + 4 Madinah" (falls back to the plain total). */
function nightsSplit(pkg: UmrahPackage): string {
  const mk = parseInt(pkg.makkahNights, 10);
  const md = parseInt(pkg.madinahNights, 10);
  if (!mk || !md) return pkg.nights;
  return `${pkg.nights} — ${mk} Makkah + ${md} Madinah`;
}

function packageTitle(pkg: UmrahPackage): string {
  return pkg.name ?? `${pkg.stars} Umrah`;
}

/** "5★ · ≈300 m from the Haram" from whichever parts exist. */
function hotelMeta(rating?: number, distance?: string): string | null {
  const parts = [rating ? `${rating}★` : null, distance ?? null].filter(
    Boolean,
  );
  return parts.length ? parts.join(" · ") : null;
}

type UmrahCardProps = {
  cityName: string;
  pkg: UmrahPackage;
  onDetails: (pkg: UmrahPackage, trigger: HTMLElement) => void;
};

function UmrahPackageCard({ cityName, pkg, onDetails }: UmrahCardProps) {
  const makkahMeta = hotelMeta(pkg.makkahRating, pkg.makkahDistance);
  const madinahMeta = hotelMeta(pkg.madinahRating, pkg.madinahDistance);
  return (
    <article
      className={`um-card ${pkg.mostPopular ? "um-card-popular" : ""}`}
    >
      <div className="um-card-media">
        <span className="um-card-media-mark" aria-hidden="true">
          🕋
        </span>
        {pkg.tier && (
          <span className={`um-tier ${TIER_CLASS[pkg.tier]}`}>{pkg.tier}</span>
        )}
        {pkg.badge && <span className="um-badge">{pkg.badge}</span>}
        {pkg.mostPopular && <span className="um-ribbon">Most Popular</span>}
      </div>
      <div className="um-card-body">
        <header className="um-card-head">
          <h3 className="um-card-name">{packageTitle(pkg)}</h3>
          <span className="um-card-sub">
            {pkg.stars} hotels · departs {cityName}
          </span>
        </header>

        <div className="um-price-block">
          <div className="um-price-row">
            <span className="um-price-from">From</span>
            <span className="um-price-value">{pkg.priceDisplay}</span>
          </div>
          <span className="um-price-unit">
            AUD per person · {pkg.roomType.toLowerCase()} share
          </span>
        </div>

        {pkg.roomRates && pkg.roomRates.length > 0 && (
          <dl className="um-rates">
            {pkg.roomRates.map((rate) => (
              <div
                key={rate.room}
                className={`um-rate ${
                  rate.room === pkg.roomType ? "um-rate-base" : ""
                }`}
              >
                <dt>{rate.room}</dt>
                <dd>{rate.priceDisplay}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="um-meta">
          <li>
            <span className="um-meta-icon" aria-hidden="true">
              🌙
            </span>
            {nightsSplit(pkg)}
          </li>
          <li>
            <span className="um-meta-icon" aria-hidden="true">
              📅
            </span>
            {pkg.departureDates?.length
              ? `Departs ${pkg.departureDates.join(" & ")}`
              : `${pkg.month} departures`}
          </li>
          {pkg.flight && (
            <li>
              <span className="um-meta-icon" aria-hidden="true">
                ✈️
              </span>
              {pkg.flight.airline} · {pkg.flight.routing}
            </li>
          )}
        </ul>

        <div className="um-hotels">
          <div className="um-hotel">
            <span className="um-hotel-city">🕋 Makkah · {pkg.makkahNights}</span>
            <span className="um-hotel-name">{pkg.makkahHotel}</span>
            {makkahMeta && <span className="um-hotel-nights">{makkahMeta}</span>}
          </div>
          <div className="um-hotel">
            <span className="um-hotel-city">
              🕌 Madinah · {pkg.madinahNights}
            </span>
            <span className="um-hotel-name">{pkg.madinahHotel}</span>
            {madinahMeta && (
              <span className="um-hotel-nights">{madinahMeta}</span>
            )}
          </div>
        </div>

        {pkg.inclusions && pkg.inclusions.length > 0 && (
          <ul className="um-incl">
            {pkg.inclusions.map((key) => (
              <li key={key}>
                <span className="um-incl-icon" aria-hidden="true">
                  {INCLUSION_META[key].icon}
                </span>
                {INCLUSION_META[key].label}
              </li>
            ))}
          </ul>
        )}

        <div className="um-card-actions">
          <Link to="/contact#inquiry-section" className="btn-primary">
            Enquire →
          </Link>
          <button
            type="button"
            className="um-btn-details"
            onClick={(e) => onDetails(pkg, e.currentTarget)}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

type UmrahDetailsModalProps = {
  cityName: string;
  pkg: UmrahPackage;
  onClose: () => void;
};

function UmrahDetailsModal({ cityName, pkg, onClose }: UmrahDetailsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>(".um-modal-close")?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="um-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="um-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="um-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="um-modal-head">
          <div className="um-modal-head-text">
            {pkg.tier && (
              <span className={`um-tier ${TIER_CLASS[pkg.tier]}`}>
                {pkg.tier}
              </span>
            )}
            <h3 id="um-modal-title">
              {packageTitle(pkg)} — from {cityName}
            </h3>
            <p className="um-modal-price">
              From {pkg.priceDisplay} AUD per person ·{" "}
              {pkg.roomType.toLowerCase()} share
            </p>
          </div>
          <button
            type="button"
            className="um-modal-close"
            onClick={onClose}
            aria-label="Close package details"
          >
            ✕
          </button>
        </header>

        <div className="um-modal-body">
          <section>
            <h4>Itinerary</h4>
            <ol>
              {buildUmrahItinerary(cityName, pkg).map((day) => (
                <li key={day}>{day}</li>
              ))}
            </ol>
          </section>

          {pkg.roomRates && pkg.roomRates.length > 0 && (
            <section>
              <h4>Pricing (per person, AUD)</h4>
              <dl className="um-rates">
                {pkg.roomRates.map((rate) => (
                  <div
                    key={rate.room}
                    className={`um-rate ${
                      rate.room === pkg.roomType ? "um-rate-base" : ""
                    }`}
                  >
                    <dt>{rate.room}</dt>
                    <dd>{rate.priceDisplay}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {pkg.inclusions && pkg.inclusions.length > 0 && (
            <section>
              <h4>Inclusions</h4>
              <ul>
                {pkg.inclusions.map((key) => (
                  <li key={key}>
                    <span className="um-incl-icon" aria-hidden="true">
                      {INCLUSION_META[key].icon}
                    </span>{" "}
                    {INCLUSION_META[key].label}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h4>Exclusions</h4>
            <ul>
              {UMRAH_EXCLUSIONS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4>Terms</h4>
            <ul>
              {UMRAH_TERMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="um-modal-foot">
          <Link to="/contact#inquiry-section" className="btn-primary">
            Enquire about this package →
          </Link>
        </footer>
      </div>
    </div>
  );
}

export function UmrahPage() {
  const location = useLocation();
  const fromPrice = getUmrahFromPrice();
  const totalPackages = getUmrahPackageCount();
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Deep-link support for the nav dropdown's per-city anchors (/umrah#perth):
  // the hash selects the matching tab (the per-city sections no longer all
  // exist in the DOM at once). Synced during render rather than in an effect
  // so the panel never flashes the previous city on navigation.
  const [activeCityId, setActiveCityId] = useState(
    () => cityIdFromHash(location.hash) ?? DEFAULT_CITY_ID,
  );
  const [navKey, setNavKey] = useState(location.key);
  if (location.key !== navKey) {
    setNavKey(location.key);
    const fromHash = cityIdFromHash(location.hash);
    if (fromHash) setActiveCityId(fromHash);
  }

  // Scroll down to the tab bar when arriving via a per-city anchor, center
  // the matching tab in the (mobile, horizontally scrollable) strip, and move
  // focus to it — mirroring native fragment navigation. "instant" rather than
  // "auto" under reduced motion: html{scroll-behavior:smooth} would otherwise
  // re-smooth it.
  useEffect(() => {
    const cityId = cityIdFromHash(location.hash);
    if (!cityId) return;
    const behavior: ScrollBehavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "instant"
      : "smooth";
    const wrap = tabsRef.current;
    if (wrap) {
      const top = wrap.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior });
    }
    const tab = document.getElementById(`um-tab-${cityId}`);
    const strip = tab?.closest(".um-tabs");
    if (tab && strip) {
      const delta =
        tab.getBoundingClientRect().left - strip.getBoundingClientRect().left;
      strip.scrollTo({
        left: strip.scrollLeft + delta - (strip.clientWidth - tab.clientWidth) / 2,
        behavior,
      });
    }
    tab?.focus({ preventScroll: true });
  }, [location]);

  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const n = UMRAH_CITIES.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % n;
    else if (e.key === "ArrowLeft") next = (index - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActiveCityId(UMRAH_CITIES[next].id);
    tabRefs.current[next]?.focus();
  };

  const activeCity =
    UMRAH_CITIES.find((c) => c.id === activeCityId) ?? UMRAH_CITIES[0];

  // "View Details" modal state; focus returns to the trigger on close.
  const [details, setDetails] = useState<{
    pkg: UmrahPackage;
    cityName: string;
  } | null>(null);
  const detailsTriggerRef = useRef<HTMLElement | null>(null);

  const openDetails = (pkg: UmrahPackage, trigger: HTMLElement) => {
    detailsTriggerRef.current = trigger;
    setDetails({ pkg, cityName: activeCity.city });
  };
  const closeDetails = useCallback(() => {
    setDetails(null);
    detailsTriggerRef.current?.focus();
    detailsTriggerRef.current = null;
  }, []);

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

      {/* PACKAGES — TABBED BY DEPARTURE CITY */}
      <div className="um-page-body">
        <div className="um-tabs-wrap" ref={tabsRef}>
          <div className="um-tabs" role="tablist" aria-label="Departure city">
            {UMRAH_CITIES.map((city, i) => (
              <button
                key={city.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`um-tab-${city.id}`}
                aria-selected={city.id === activeCity.id}
                // Only the active panel is mounted, so only the selected tab
                // gets aria-controls — its target is the panel's bare city id
                // (kept bare for the /umrah#perth nav anchors).
                aria-controls={city.id === activeCity.id ? city.id : undefined}
                tabIndex={city.id === activeCity.id ? 0 : -1}
                className={`um-tab ${city.id === activeCity.id ? "active" : ""}`}
                onClick={() => setActiveCityId(city.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {city.city}
                <span className="um-tab-count">{city.packages.length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* key remounts the panel so the fade/slide-in replays on tab switch */}
        <section
          key={activeCity.id}
          id={activeCity.id}
          role="tabpanel"
          aria-labelledby={`um-tab-${activeCity.id}`}
          className="um-city um-tab-panel"
        >
          <div className="um-city-head">
            <h2 className="um-city-title">From {activeCity.city}</h2>
            <span className="um-city-meta">
              {activeCity.packages.length} packages · September departures
            </span>
          </div>
          {activeCity.packages.length === 0 ? (
            <div className="um-empty">
              <span className="um-empty-icon" aria-hidden="true">
                🕋
              </span>
              <p>
                No packages available for {activeCity.city} yet — check back
                soon.
              </p>
            </div>
          ) : (
            <div className="um-grid">
              {activeCity.packages.map((pkg) => (
                <UmrahPackageCard
                  key={pkg.id}
                  cityName={activeCity.city}
                  pkg={pkg}
                  onDetails={openDetails}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {details && (
        <UmrahDetailsModal
          cityName={details.cityName}
          pkg={details.pkg}
          onClose={closeDetails}
        />
      )}

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
