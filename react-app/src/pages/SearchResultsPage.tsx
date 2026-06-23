import { useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getDestination, getPriceForMonth } from "../data/destinations";
import { useDestinations } from "../contexts/destinationsContext";
import { SearchBar } from "../components/SearchBar";
import { WhatsIncludedTabs } from "../components/WhatsIncludedTabs";
import "./SearchResultsPage.css";

const MONTH_FROM_CODE: Record<string, string> = {
  JAN: "January",
  FEB: "February",
  MAR: "March",
  APR: "April",
  MAY: "May",
  JUN: "June",
  JUL: "July",
  AUG: "August",
  SEP: "September",
  OCT: "October",
  NOV: "November",
  DEC: "December",
};

function parseAmount(amount: string): number {
  return Number(amount.replace(/[^0-9.]/g, "")) || 0;
}

function parsePriceDisplay(priceDisplay: string): {
  currency: string;
  amount: number;
} {
  const symbol = priceDisplay.match(/[$€]/)?.[0] ?? "";
  const numeric = parseAmount(priceDisplay);
  return { currency: symbol, amount: numeric };
}

function formatCurrency(amount: number, currency: string, code?: string): string {
  const formatted = amount.toLocaleString("en-US");
  if (currency === "$" && code) return `${code} $${formatted}`;
  if (currency === "$") return `$${formatted}`;
  if (currency) return `${currency}${formatted}`;
  return formatted;
}

export function SearchResultsPage() {
  const [params] = useSearchParams();
  const destinationSlug = params.get("destination") ?? "";
  const monthCode = (params.get("month") ?? "").toUpperCase();
  const personsParam = Number(params.get("persons") ?? "2");
  const persons = Number.isFinite(personsParam) && personsParam > 0
    ? Math.min(10, Math.max(1, Math.floor(personsParam)))
    : 2;

  const { destinations, loading } = useDestinations();
  const destination = getDestination(destinations, destinationSlug);
  const monthFull = MONTH_FROM_CODE[monthCode] || "";

  const isMakkah = destination?.slug === "makkah-madinah";
  const [selectedPackageIndex, setSelectedPackageIndex] = useState<number>(1);
  const [editing, setEditing] = useState(false);

  // Enquiry form state.
  const [srName, setSrName] = useState("");
  const [srEmail, setSrEmail] = useState("");
  const [srMsg, setSrMsg] = useState("");
  const [srWebsite, setSrWebsite] = useState(""); // honeypot
  const [srStatus, setSrStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const monthlyPrice = useMemo(() => {
    if (!destination || !monthFull) return undefined;
    return getPriceForMonth(destination, monthFull);
  }, [destination, monthFull]);

  if (loading) {
    return <div className="sr-notfound"><p>Loading…</p></div>;
  }

  if (!destination) {
    return (
      <div className="sr-notfound">
        <h2>Destination not found</h2>
        <p>
          We couldn't find a package matching your search — please try another
          destination from our collection.
        </p>
        <Link to="/destinations" className="btn btn-gold">
          Browse all destinations →
        </Link>
      </div>
    );
  }

  const related = destinations.filter((d) => d.slug !== destination.slug).slice(
    0,
    3
  );

  const submitSearchEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSrStatus("submitting");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote",
          name: srName,
          email: srEmail,
          payload: {
            destination: destination.name,
            month: monthFull,
            persons,
            message: srMsg,
          },
          source_page: "/search-results",
          website: srWebsite, // honeypot — must stay empty
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSrStatus("success");
    } catch {
      setSrStatus("error");
    }
  };

  const summaryParts = [
    destination.name,
    monthFull || "Any month",
    `${persons} ${persons === 1 ? "Adult" : "Adults"}`,
  ];

  // Price calculation
  let priceBlock: ReactNode = null;
  let priceUnavailable = false;

  if (isMakkah) {
    const pkg =
      destination.packages?.[selectedPackageIndex] ??
      destination.packages?.[1] ??
      destination.packages?.[0];
    if (pkg) {
      const { currency, amount } = parsePriceDisplay(pkg.priceDisplay);
      const total = amount * persons;
      priceBlock = (
        <>
          <div className="sr-price-row">
            <span className="sr-price-label">Base price (per person)</span>
            <div className="sr-price-figures">
              <strong>{pkg.priceDisplay}</strong>
              <small>
                × {persons} {persons === 1 ? "adult" : "adults"}
              </small>
            </div>
          </div>
          <div className="sr-price-divider" />
          <div className="sr-price-total">
            <span>Total Estimate</span>
            <strong>{formatCurrency(total, currency || "A$")}</strong>
          </div>
          <div className="sr-price-note">{pkg.name} · {pkg.duration}</div>
        </>
      );
    }
  } else if (monthlyPrice) {
    const amount = parseAmount(monthlyPrice.amount);
    const total = amount * persons;
    priceBlock = (
      <>
        <div className="sr-price-row">
          <span className="sr-price-label">Base price (per person)</span>
          <div className="sr-price-figures">
            <strong>{monthlyPrice.display}</strong>
            <small>
              × {persons} {persons === 1 ? "adult" : "adults"}
            </small>
          </div>
        </div>
        <div className="sr-price-divider" />
        <div className="sr-price-total">
          <span>Total Estimate</span>
          <strong>{formatCurrency(total, "$", monthlyPrice.currency)}</strong>
        </div>
      </>
    );
  } else {
    priceUnavailable = true;
    priceBlock = (
      <div className="sr-price-unavailable">
        <div className="sr-price-unavailable-icon">ⓘ</div>
        <strong>Price not available for this month</strong>
        <p>
          {monthFull
            ? `${destination.name} doesn't currently have a published price for ${monthFull}.`
            : "Choose a month to see published pricing."}{" "}
          Please enquire and our specialists will tailor a quote.
        </p>
      </div>
    );
  }

  return (
    <div className="sr-page">
      {/* HERO — sits at top so the fixed nav is transparent over it */}
      <section className="sr-hero">
        <div className="sr-hero-bg">
          <img src={destination.heroImage} alt={destination.name} />
        </div>
        <div className="sr-hero-overlay" />
        <div className="sr-hero-content">
          <div className="sr-hero-region">
            {destination.regionLabel} · {destination.subtitle}
          </div>
          <h1 className="sr-hero-title">{destination.name}</h1>
          <p className="sr-hero-tagline">{destination.tagline}</p>
        </div>
      </section>

      {/* SUMMARY BAR — sticky just below the nav once user scrolls past the hero */}
      <div className="sr-summary-bar">
        <div className="sr-summary-inner">
          <div className="sr-summary-text">
            <span className="sr-summary-label">Your search</span>
            <strong>{summaryParts.join(" · ")}</strong>
          </div>
          <button
            type="button"
            className="sr-edit-btn"
            onClick={() => setEditing((v) => !v)}
            aria-expanded={editing}
          >
            {editing ? "Close" : "Edit search"} {editing ? "✕" : "✎"}
          </button>
        </div>
        {editing && (
          <div className="sr-edit-panel">
            <SearchBar
              variant="light"
              initialDestinationSlug={destination.slug}
              initialMonth={monthFull || undefined}
              initialPersons={persons}
              onSubmitted={() => setEditing(false)}
            />
          </div>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="sr-wrap">
        <div className="sr-grid">
          {/* PACKAGE SUMMARY */}
          <div className="sr-package-col">
            <WhatsIncludedTabs
              destination={destination}
              selectedPackageIndex={isMakkah ? selectedPackageIndex : undefined}
              onPackageChange={isMakkah ? setSelectedPackageIndex : undefined}
            />

            {/* IMPORTANT NOTES */}
            <div className="sr-notes">
              <h4>Important notes</h4>
              <ul>
                <li>All prices are per person based on twin/quad share.</li>
                <li>Prices subject to availability and change without notice.</li>
                <li>International flights are not included unless stated.</li>
                <li>Contact us for group bookings of 5+ persons.</li>
              </ul>
            </div>
          </div>

          {/* PRICE SUMMARY */}
          <aside className="sr-price-col" id="sr-enquire">
            <div className="sr-price-card">
              <div className="sr-price-header">
                <span className="sr-price-eyebrow">Price summary</span>
                <h3>{destination.name}</h3>
                <span className="sr-price-when">
                  {monthFull || "Any departure month"}
                </span>
              </div>
              <div className="sr-price-body">
                {priceBlock}

                <div className="sr-price-finepr">
                  <span>* Prices are per person</span>
                  <span>* Subject to availability</span>
                </div>

                <a
                  href="#sr-enquire-form"
                  className="btn btn-gold sr-enquire-btn"
                >
                  Enquire Now ↗
                </a>
                <Link to="/destinations" className="sr-back-link">
                  ← Back to destinations
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ENQUIRY FORM */}
        <section className="sr-enquire-form-wrap" id="sr-enquire-form">
          <div className="sr-enquire-card">
            <div className="sr-enquire-head">
              <div className="section-eyebrow">Enquire</div>
              <h2 className="section-title">Get a tailored quote</h2>
              <p>
                Tell us a little about your trip and our specialists will reply
                within 2 working hours{priceUnavailable ? " with a custom price for your dates" : ""}.
              </p>
            </div>
            <form className="sr-enquire-form" onSubmit={submitSearchEnquiry}>
              {srStatus === "success" ? (
                <div role="status" style={{ textAlign: "center", padding: "8px 0" }}>
                  <div style={{ fontSize: 36 }}>✅</div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--navy)",
                      margin: "8px 0 4px",
                    }}
                  >
                    Thank you!
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", color: "var(--stone-dark)" }}>
                    A specialist will be in touch shortly.
                  </p>
                </div>
              ) : (
                <>
                  {/* Honeypot — hidden from real users. */}
                  <input
                    type="text"
                    name="website"
                    value={srWebsite}
                    onChange={(e) => setSrWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: 1,
                      height: 1,
                      opacity: 0,
                    }}
                  />
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="sr-name">Name</label>
                      <input
                        className="form-input"
                        id="sr-name"
                        type="text"
                        placeholder="Full name"
                        required
                        value={srName}
                        onChange={(e) => setSrName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="sr-email">Email</label>
                      <input
                        className="form-input"
                        id="sr-email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={srEmail}
                        onChange={(e) => setSrEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sr-msg">Message</label>
                    <textarea
                      className="form-input"
                      id="sr-msg"
                      rows={3}
                      placeholder={`Tell us about your ${destination.name} trip…`}
                      style={{ resize: "vertical" }}
                      value={srMsg}
                      onChange={(e) => setSrMsg(e.target.value)}
                    />
                  </div>
                  {srStatus === "error" && (
                    <div
                      role="alert"
                      style={{ color: "#c0392b", fontSize: 13, margin: "0 0 10px" }}
                    >
                      Sorry, something went wrong. Please try again, or contact us
                      directly.
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-gold"
                    style={{ justifyContent: "center", width: "100%", padding: 14 }}
                    disabled={srStatus === "submitting"}
                  >
                    {srStatus === "submitting" ? "Sending…" : "Send enquiry ↗"}
                  </button>
                </>
              )}
            </form>
          </div>
        </section>

        {/* RELATED */}
        <section className="sr-related">
          <div className="section-eyebrow">You might also like</div>
          <h2 className="section-title">Other journeys in our collection</h2>
          <div className="related-grid">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/destinations/${r.slug}`}
                className="related-card"
              >
                <div className="related-img">
                  <img src={r.image} alt={r.name} />
                  <div className="related-overlay" />
                  <div className="related-name-overlay">{r.name}</div>
                </div>
                <div className="related-body">
                  <div className="related-region">{r.regionLabel}</div>
                  <div className="related-price">
                    <strong>{r.fromPrice}</strong>
                    <span>Explore →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
