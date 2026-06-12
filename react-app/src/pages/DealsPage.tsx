import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DESTINATIONS } from "../data/destinations";
import "./DealsPage.css";

const CATEGORIES = [
  { value: "all", label: `All Deals (${DESTINATIONS.length})` },
  { value: "beach", label: "🏖 Beach & Islands" },
  { value: "culture", label: "🏛 Cultural & Heritage" },
  { value: "family", label: "👨‍👩‍👧 Family" },
  { value: "honeymoon", label: "💍 Honeymoon" },
  { value: "safari", label: "🦁 Safari" },
  { value: "cruise", label: "🛳 Cruise" },
];

function parsePrice(s: string): number {
  return Number(s.replace(/[^0-9.]/g, "")) || 0;
}

type SortValue = "popular" | "price-asc" | "price-desc" | "alpha";

export function DealsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = (searchParams.get("cat") ?? "all").toLowerCase();

  const [activeCat, setActiveCat] = useState(initialCat);
  const [sort, setSort] = useState<SortValue>("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ title: string } | null>(null);

  // Sync category state ↔ URL query param directly in render (recommended for synchronous URL sync)
  const fromUrl = (searchParams.get("cat") ?? "all").toLowerCase();
  if (fromUrl !== activeCat) {
    setActiveCat(fromUrl);
  }

  const selectCategory = (value: string) => {
    setActiveCat(value);
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("cat");
    else next.set("cat", value);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    let list = DESTINATIONS.filter((d) => {
      if (activeCat === "all") return true;
      const styles = d.styles.map((s) => s.toLowerCase());
      return styles.includes(activeCat);
    });
    if (sort === "price-asc")
      list = [...list].sort((a, b) => parsePrice(a.fromPrice) - parsePrice(b.fromPrice));
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => parsePrice(b.fromPrice) - parsePrice(a.fromPrice));
    else if (sort === "alpha")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCat, sort]);

  const toggleWish = (id: string) =>
    setWishlist((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <>
      {/* HERO */}
      <div className="dp-page-hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1600&q=80"
            alt="Luxury deals"
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="dp-breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Deals &amp; Packages</span>
          </div>
          <div className="dp-hero-eyebrow">Live published prices</div>
          <h1 className="dp-hero-title">
            Four Curated Journeys,
            <br />
            <em>Fully Priced</em>
          </h1>
          <p className="dp-hero-sub">
            Every package below is fully costed with no hidden extras. Choose your
            departure month and book direct with our specialists.
          </p>
          <div className="dp-hero-meta-row">
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>
              <strong>{DESTINATIONS.length}</strong> curated packages
            </div>
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>From <strong>AUD $2,088</strong>
            </div>
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>
              <strong>fully protected</strong>
            </div>
            <div className="dp-hero-meta-item">
              <div className="dp-hero-meta-dot"></div>No <strong>booking fees</strong>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="cat-tabs-bar">
        <div className="cat-tabs-inner">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.value}
              className={`cat-tab ${activeCat === c.value ? "active" : ""}`}
              onClick={() => selectCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* TRUST STRIP */}
      <div className="trust-strip">
        <div className="trust-inner">
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <div>
              <strong>Fully Protected</strong>Every booking guaranteed
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">💰</span>
            <div>
              <strong>Price Match</strong>Find it cheaper, we'll match
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">☎</span>
            <div>
              <strong>24/7 Support</strong>On-trip assistance always
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">✈</span>
            <div>
              <strong>No Booking Fees</strong>What you see is what you pay
            </div>
          </div>
        </div>
      </div>

      {/* DEALS */}
      <div className="dp-page-body" style={{ gridTemplateColumns: "1fr" }}>
        <div className="content">
          <div className="toolbar">
            <div className="res-count">
              <strong>{filtered.length}</strong> packages available
            </div>
            <div className="toolbar-right">
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortValue)}
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="alpha">Alphabetical</option>
              </select>
              <div className="view-tog">
                <button
                  type="button"
                  className={`vbtn ${view === "grid" ? "on" : ""}`}
                  onClick={() => setView("grid")}
                  title="Grid"
                >
                  ⊞
                </button>
                <button
                  type="button"
                  className={`vbtn ${view === "list" ? "on" : ""}`}
                  onClick={() => setView("list")}
                  title="List"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          <div className={`dp-deals-grid ${view === "list" ? "lv" : ""}`}>
            {filtered.map((d) => {
              const pricing = d.pricing ?? [];
              const packages = d.packages ?? [];
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
                    <button
                      type="button"
                      className={`card-wish ${wishlist.has(d.slug) ? "wished" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWish(d.slug);
                      }}
                      aria-label={`Wishlist ${d.name}`}
                    >
                      {wishlist.has(d.slug) ? "♥" : "♡"}
                    </button>
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
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 12,
                        }}
                      >
                        {pricing.map((p) => (
                          <span
                            key={p.month}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 10,
                              fontWeight: 600,
                              letterSpacing: ".08em",
                              textTransform: "uppercase",
                              padding: "4px 10px",
                              borderRadius: "var(--r-pill)",
                              background: "var(--gold-pale)",
                              color: "var(--gold)",
                              border: "1px solid rgba(13,110,253,.2)",
                            }}
                          >
                            {p.month} · {p.display}
                          </span>
                        ))}
                      </div>
                    )}
                    {packages.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          marginBottom: 12,
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--stone-dark)",
                        }}
                      >
                        {packages.map((p) => (
                          <span key={p.id}>
                            <strong style={{ color: "var(--navy)" }}>{p.name}</strong>{" "}
                            · {p.duration} · {p.priceDisplay}
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
        </div>
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>
        <div className="toast-inner">
          <span className="toast-icon">✅</span>
          <div>
            <p className="toast-title">{toast?.title || "Enquiry sent!"}</p>
            <p className="toast-text">
              Our specialist will contact you within 2 working hours.
            </p>
          </div>
          <button type="button" className="toast-close" onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      </div>
    </>
  );
}
