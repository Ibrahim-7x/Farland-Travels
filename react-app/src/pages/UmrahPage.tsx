import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UMRAH_EXCLUSIONS,
  UMRAH_TERMS,
  buildUmrahItinerary,
  lowestPriceDisplay,
} from "../data/umrahContent";
import type {
  UmrahInclusion,
  UmrahPackage,
  UmrahTier,
} from "../data/umrahContent";
import "./DealsPage.css";
import "./UmrahPage.css";

/** Raw shape returned by GET /api/umrah-packages (camelCase, nullable). */
type ApiPackage = {
  id: string;
  city: string;
  stars: string;
  nights: string;
  roomType: string;
  month: string | null;
  makkahHotel: string | null;
  makkahNights: string | null;
  makkahRating: number | null;
  makkahDistance: string | null;
  madinahHotel: string | null;
  madinahNights: string | null;
  madinahRating: number | null;
  madinahDistance: string | null;
  price: number;
  priceDisplay: string | null;
  name: string | null;
  tier: string | null;
  departureDates: string[] | null;
  roomRates: { room: string; priceDisplay: string }[] | null;
  flight: { airline: string; routing: string } | null;
  inclusions: string[] | null;
  badge: string | null;
  mostPopular: boolean;
};

/** A normalised package that also carries its departure city for filtering. */
type FlatPackage = UmrahPackage & { city: string };

type City = { id: string; name: string; sortOrder?: number };

function normalize(raw: ApiPackage): FlatPackage {
  return {
    id: raw.id,
    city: raw.city,
    stars: raw.stars,
    nights: raw.nights,
    roomType: raw.roomType,
    month: raw.month ?? "",
    makkahHotel: raw.makkahHotel ?? "",
    makkahNights: raw.makkahNights ?? "",
    madinahHotel: raw.madinahHotel ?? "",
    madinahNights: raw.madinahNights ?? "",
    price: raw.price,
    priceDisplay: raw.priceDisplay ?? "",
    name: raw.name ?? undefined,
    tier: (raw.tier as UmrahTier | null) ?? undefined,
    departureDates: raw.departureDates ?? undefined,
    roomRates: raw.roomRates ?? undefined,
    makkahRating: raw.makkahRating ?? undefined,
    makkahDistance: raw.makkahDistance ?? undefined,
    madinahRating: raw.madinahRating ?? undefined,
    madinahDistance: raw.madinahDistance ?? undefined,
    flight: raw.flight ?? undefined,
    inclusions: (raw.inclusions as UmrahInclusion[] | null) ?? undefined,
    badge: (raw.badge as UmrahPackage["badge"]) ?? undefined,
    mostPopular: raw.mostPopular || undefined,
  };
}

/** Star-rating tabs. Membership is derived by matching the digit in the
 *  free-text `stars` field (e.g. "5/4 Star" appears under both 5 and 4). */
const RATING_TABS = [
  { id: "all", label: "All Packages" },
  { id: "5", label: "5-Star" },
  { id: "4", label: "4-Star" },
  { id: "3", label: "3-Star" },
] as const;
type RatingId = (typeof RATING_TABS)[number]["id"];

function matchesRating(stars: string, rating: RatingId): boolean {
  return rating === "all" || stars.includes(rating);
}

/** "Gold Coast" → "gold-coast" — matches the anchor slugs used in nav links. */
function citySlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
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
        </ul>

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
  const makkahMeta = hotelMeta(pkg.makkahRating, pkg.makkahDistance);
  const madinahMeta = hotelMeta(pkg.madinahRating, pkg.madinahDistance);

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
            <p className="um-modal-meta-line">
              <span aria-hidden="true">📅</span>{" "}
              {pkg.departureDates?.length
                ? `Departs ${pkg.departureDates.join(" & ")}`
                : `${pkg.month} departures`}
            </p>
            {pkg.flight && (
              <p className="um-modal-meta-line">
                <span aria-hidden="true">✈️</span> {pkg.flight.airline} ·{" "}
                {pkg.flight.routing}
              </p>
            )}
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
            <h4>Hotels</h4>
            <div className="um-hotels">
              <div className="um-hotel">
                <span className="um-hotel-city">🕋 Makkah · {pkg.makkahNights}</span>
                <span className="um-hotel-name">{pkg.makkahHotel}</span>
                {makkahMeta && <span className="um-hotel-nights">{makkahMeta}</span>}
              </div>
              <div className="um-hotel">
                <span className="um-hotel-city">🕌 Madinah · {pkg.madinahNights}</span>
                <span className="um-hotel-name">{pkg.madinahHotel}</span>
                {madinahMeta && <span className="um-hotel-nights">{madinahMeta}</span>}
              </div>
            </div>
          </section>

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

/** Three placeholder cards shown while packages load. */
function SkeletonGrid() {
  const bar = (w: string): React.CSSProperties => ({
    height: 14,
    width: w,
    borderRadius: "var(--r-sm)",
    background: "var(--ivory-mid)",
  });
  return (
    <div className="um-grid" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <article className="um-card" key={i}>
          <div
            className="um-card-media"
            style={{ background: "var(--ivory-mid)" }}
          />
          <div
            className="um-card-body"
            style={{ display: "grid", gap: 12, padding: 20 }}
          >
            <div style={bar("70%")} />
            <div style={bar("45%")} />
            <div style={{ ...bar("35%"), height: 28 }} />
            <div style={bar("90%")} />
            <div style={bar("80%")} />
          </div>
        </article>
      ))}
    </div>
  );
}

type LoadStatus = "loading" | "error" | "ready";

export function UmrahPage() {
  const location = useLocation();
  const tabsRef = useRef<HTMLDivElement>(null);

  const [packages, setPackages] = useState<FlatPackage[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");

  // Filter state: star rating tab + departure city ("" = all cities).
  const [activeRating, setActiveRating] = useState<RatingId>("all");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Fetch published packages once on mount.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/umrah-packages", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ApiPackage[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setPackages(data.map(normalize));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch the admin-managed city list for the dropdown (best-effort).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cities", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<City[]>) : []))
      .then((data) => {
        if (!cancelled) setCities(data);
      })
      .catch(() => {
        /* dropdown falls back to cities found in the packages */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // City options: prefer the managed list; fall back to distinct package
  // cities. Either way, only show cities that actually have packages so the
  // dropdown never offers an empty result.
  const cityOptions = useMemo(() => {
    const withPackages = new Set(packages.map((p) => p.city));
    const managed = cities
      .map((c) => c.name)
      .filter((name) => withPackages.has(name));
    const fallback = Array.from(withPackages).sort((a, b) =>
      a.localeCompare(b),
    );
    return managed.length ? managed : fallback;
  }, [cities, packages]);

  // Preselect a city when arriving via a hash deep-link (e.g. /umrah#sydney).
  // Resolved during render — not in an effect — so it applies the moment the
  // city or package data loads, without a cascading re-render. The key guard
  // makes it run once per navigation (and again on a fresh deep-link).
  const [hashAppliedKey, setHashAppliedKey] = useState<string | null>(null);
  const hashSlug = location.hash.slice(1);
  const dataReady = cities.length > 0 || packages.length > 0;
  if (hashSlug && dataReady && hashAppliedKey !== location.key) {
    const match =
      cities.find((c) => c.id === hashSlug)?.name ??
      packages.find((p) => citySlug(p.city) === hashSlug)?.city;
    setHashAppliedKey(location.key);
    if (match) setSelectedCity(match);
  }

  // Smooth-scroll the filter bar into view on a hash deep-link (side effect).
  useEffect(() => {
    if (!location.hash) return;
    const wrap = tabsRef.current;
    if (!wrap) return;
    const behavior: ScrollBehavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "instant"
      : "smooth";
    const top = wrap.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior });
  }, [location]);

  // Apply the city filter first, then derive per-rating counts from it so the
  // tab numbers reflect the chosen city.
  const cityFiltered = useMemo(
    () => packages.filter((p) => !selectedCity || p.city === selectedCity),
    [packages, selectedCity],
  );

  const ratingCounts = useMemo(() => {
    const counts: Record<RatingId, number> = { all: 0, "5": 0, "4": 0, "3": 0 };
    for (const tab of RATING_TABS) {
      counts[tab.id] = cityFiltered.filter((p) =>
        matchesRating(p.stars, tab.id),
      ).length;
    }
    return counts;
  }, [cityFiltered]);

  const visiblePackages = useMemo(
    () => cityFiltered.filter((p) => matchesRating(p.stars, activeRating)),
    [cityFiltered, activeRating],
  );

  const totalPackages = packages.length;
  const fromPrice = lowestPriceDisplay(packages);

  // "View Details" modal state; focus returns to the trigger on close.
  const [details, setDetails] = useState<{
    pkg: UmrahPackage;
    cityName: string;
  } | null>(null);
  const detailsTriggerRef = useRef<HTMLElement | null>(null);

  const openDetails = (pkg: UmrahPackage, trigger: HTMLElement) => {
    detailsTriggerRef.current = trigger;
    const cityName = (pkg as FlatPackage).city ?? "";
    setDetails({ pkg, cityName });
  };
  const closeDetails = useCallback(() => {
    setDetails(null);
    detailsTriggerRef.current?.focus();
    detailsTriggerRef.current = null;
  }, []);

  const activeTabLabel =
    RATING_TABS.find((t) => t.id === activeRating)?.label ?? "Packages";

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
          <div className="dp-hero-eyebrow">Fully-priced packages</div>
          <h1 className="dp-hero-title">
            Umrah Packages,
            <br />
            <em>Fully Priced</em>
          </h1>
          <p className="dp-hero-sub">
            Curated Umrah packages across 5-, 4- and 3-star hotels steps from
            the Haram and Masjid al-Nabawi. Filter by hotel rating, then choose
            your departure city and book direct with our specialists.
          </p>
          <div className="dp-hero-meta-row">
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>
              <strong>{status === "ready" ? totalPackages : "—"}</strong>{" "}
              curated packages
            </div>
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>From{" "}
              <strong>{status === "ready" && fromPrice ? fromPrice : "—"}</strong>
            </div>
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>
              <strong>{status === "ready" ? cityOptions.length : "—"}</strong>{" "}
              departure cities
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

      {/* PACKAGES — FILTERED BY HOTEL RATING + DEPARTURE CITY */}
      <div className="um-page-body">
        {status === "loading" && (
          <div className="um-city um-tab-panel">
            <div className="um-city-head">
              <h2 className="um-city-title">Loading packages…</h2>
            </div>
            <SkeletonGrid />
          </div>
        )}

        {status === "error" && (
          <div className="um-city um-tab-panel">
            <div className="um-empty">
              <span className="um-empty-icon" aria-hidden="true">
                ⚠️
              </span>
              <p>Unable to load packages. Please try again.</p>
            </div>
          </div>
        )}

        {status === "ready" && packages.length === 0 && (
          <div className="um-city um-tab-panel">
            <div className="um-empty">
              <span className="um-empty-icon" aria-hidden="true">
                🕋
              </span>
              <p>No packages available right now — please check back soon.</p>
            </div>
          </div>
        )}

        {status === "ready" && packages.length > 0 && (
          <>
            {/* Rating tabs + city dropdown */}
            <div className="um-filter-bar" ref={tabsRef}>
              <div className="um-tabs" role="tablist" aria-label="Hotel rating">
                {RATING_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={tab.id === activeRating}
                    className={`um-tab ${
                      tab.id === activeRating ? "active" : ""
                    }`}
                    onClick={() => setActiveRating(tab.id)}
                  >
                    {tab.label}
                    <span className="um-tab-count">{ratingCounts[tab.id]}</span>
                  </button>
                ))}
              </div>

              <label className="um-city-select">
                <span className="um-city-select-label">City</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  aria-label="Filter by departure city"
                >
                  <option value="">All cities</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* key remounts the panel so the fade/slide-in replays on filter change */}
            <section
              key={`${activeRating}-${selectedCity}`}
              className="um-city um-tab-panel"
            >
              <div className="um-city-head">
                <h2 className="um-city-title">
                  {activeTabLabel}
                  {selectedCity ? ` from ${selectedCity}` : ""}
                </h2>
                <span className="um-city-meta">
                  {visiblePackages.length}{" "}
                  {visiblePackages.length === 1 ? "package" : "packages"}
                </span>
              </div>
              {visiblePackages.length === 0 ? (
                <div className="um-empty">
                  <span className="um-empty-icon" aria-hidden="true">
                    🕋
                  </span>
                  <p>
                    No {activeRating === "all" ? "" : `${activeRating}-star `}
                    packages
                    {selectedCity ? ` from ${selectedCity}` : ""} right now —
                    try another filter.
                  </p>
                </div>
              ) : (
                <div className="um-grid">
                  {visiblePackages.map((pkg) => (
                    <UmrahPackageCard
                      key={pkg.id}
                      cityName={pkg.city}
                      pkg={pkg}
                      onDetails={openDetails}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {details && (
        <UmrahDetailsModal
          cityName={details.cityName}
          pkg={details.pkg}
          onClose={closeDetails}
        />
      )}
    </>
  );
}
