import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDestination } from "../data/destinations";
import { useDestinations } from "../contexts/destinationsContext";
import { WhatsIncludedTabs } from "../components/WhatsIncludedTabs";
import "./DestinationDetailPage.css";

export function DestinationDetailPage() {
  const { slug } = useParams();
  const { destinations, loading } = useDestinations();
  const destination = getDestination(destinations, slug);
  const [stickyVisible, setStickyVisible] = useState(false);

  // Enquiry form state.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [month, setMonth] = useState("");
  const [travellers, setTravellers] = useState("2 adults");
  const [requests, setRequests] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [ddStatus, setDdStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("dd-hero");
      if (!hero) return;
      setStickyVisible(hero.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lowestPrice = useMemo(() => {
    if (!destination?.pricing) return null;
    return destination.pricing.reduce((min, p) =>
      Number(p.amount.replace(/,/g, "")) < Number(min.amount.replace(/,/g, ""))
        ? p
        : min
    );
  }, [destination]);

  if (loading) {
    return <div className="dd-notfound"><p>Loading…</p></div>;
  }

  if (!destination) {
    return (
      <div className="dd-notfound">
        <h2>Destination not found</h2>
        <p>We couldn't find that destination — please choose one from the list.</p>
        <Link to="/destinations" className="btn btn-gold">
          Browse all destinations →
        </Link>
      </div>
    );
  }

  const related = destinations.filter((d) => d.slug !== destination.slug).slice(0, 3);

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setDdStatus("submitting");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote",
          name,
          email,
          phone,
          payload: { destination: destination.name, month, travellers, requests },
          source_page: `/destinations/${destination.slug}`,
          website, // honeypot — must stay empty
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDdStatus("success");
    } catch {
      setDdStatus("error");
    }
  };

  return (
    <>
      {/* HERO */}
      <section id="dd-hero">
        <div className="hero-bg">
          <img src={destination.heroImage} alt={destination.name} />
        </div>
        <div className="hero-overlay"></div>
        <div className="dd-hero-content">
          <div className="dd-breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/destinations">Destinations</Link>
            <span className="sep">/</span>
            <span>{destination.name}</span>
          </div>
          <div className="dd-hero-region">
            {destination.regionLabel} · {destination.subtitle}
          </div>
          <h1 className="dd-hero-title">{destination.name}</h1>
          <p className="dd-hero-tagline">{destination.tagline}</p>
          <div className="dd-hero-meta">
            {destination.metaItems.map((m, i) => (
              <div key={i} className="dd-hero-meta-item">
                <div className="dot"></div>
                <strong>{m.strong}</strong> {m.rest}
              </div>
            ))}
          </div>
          <div className="dd-hero-btns">
            <a href="#inquiry" className="btn btn-gold">
              Enquire now ↗
            </a>
            <a href="#package-details" className="btn btn-outline-white">
              View package details
            </a>
          </div>
        </div>
      </section>

      {/* STICKY BAR */}
      <div className={`sticky-bar ${stickyVisible ? "visible" : ""}`}>
        <div className="sticky-bar-inner">
          <div className="sticky-dest">{destination.name}</div>
          <div className="sticky-price">
            <small>From per person</small>
            {destination.fromPrice}
          </div>
          <div className="sticky-actions">
            <a href="#inquiry" className="btn btn-gold">
              Enquire now ↗
            </a>
            <a href="#package-details" className="btn btn-outline">
              View details
            </a>
          </div>
        </div>
      </div>

      <div className="dd-page-wrap">
        <div className="dd-main-grid">
          <div>
            {/* OVERVIEW */}
            <section className="dd-section reveal" id="overview">
              <h2 className="section-title">{destination.subtitle}</h2>
              <p className="section-body">{destination.description}</p>

              {destination.highlights && (
                <div className="highlights-grid">
                  {destination.highlights.map((h, i) => (
                    <div className="highlight-card" key={i}>
                      <div className="highlight-icon">{h.icon}</div>
                      <div className="highlight-text">
                        <h4>{h.title}</h4>
                        <p>{h.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* PACKAGE DETAILS */}
            <section className="dd-section reveal" id="package-details">
              <h2 className="section-title">Package Details</h2>
              <p className="section-body">
                Every component below is included in your published price. Customise any
                element with our travel specialists.
              </p>

              <WhatsIncludedTabs destination={destination} />

              {destination.packagesNote && (
                <p className="packages-note">{destination.packagesNote}</p>
              )}
            </section>

            {/* MONTHLY PRICING */}
            {destination.pricing && destination.pricing.length > 0 && (
              <section className="dd-section reveal pricing-section" id="pricing">
                <div className="pricing-header">
                  <div>
                    <h3>Pricing per month</h3>
                    <p>
                      All prices are per person. Speak to our specialists to confirm
                      availability and lock in your preferred departure date.
                    </p>
                  </div>
                </div>
                <div className="pricing-grid">
                  {destination.pricing.map((p) => {
                    const isFeatured = lowestPrice && p.month === lowestPrice.month;
                    return (
                      <div
                        key={p.month}
                        className={`price-card ${isFeatured ? "featured" : ""}`}
                      >
                        <div className="price-month">{p.month}</div>
                        <div className="price-amount">{p.display}</div>
                        <span className="price-per">per person · {p.currency}</span>
                        <a href="#inquiry" className="price-cta">
                          Enquire for {p.month} →
                        </a>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* RELATED */}
            <section className="dd-section reveal">
              <h2 className="section-title">More from our collection</h2>
              <div className="related-grid">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/destinations/${r.slug}`}
                    className="related-card"
                  >
                    <div className="related-img">
                      <img src={r.image} alt={r.name} />
                      <div className="related-overlay"></div>
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

          {/* INQUIRY SIDEBAR */}
          <div id="inquiry">
            <form className="inquiry-box" onSubmit={submitEnquiry}>
              <div className="inquiry-header">
                <div className="inquiry-header-price">
                  <small>Tailor-made packages from</small>
                  {destination.fromPrice} <span>per person</span>
                </div>
              </div>
              <div className="inquiry-body">
                {ddStatus === "success" ? (
                  <div role="status" style={{ textAlign: "center", padding: "24px 8px" }}>
                    <div style={{ fontSize: 40 }}>✅</div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--navy)",
                        margin: "10px 0 6px",
                      }}
                    >
                      Enquiry sent!
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--stone-dark)",
                        lineHeight: 1.6,
                      }}
                    >
                      Thank you — our specialist will reply within 2 working hours.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Honeypot — hidden from real users. */}
                    <input
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
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
                    <div className="form-group">
                      <label className="form-label" htmlFor="dd-name">Your name</label>
                      <input
                        className="form-input"
                        id="dd-name"
                        type="text"
                        placeholder="Full name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="dd-email">Email</label>
                        <input
                          className="form-input"
                          id="dd-email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="dd-phone">Phone</label>
                        <input
                          className="form-input"
                          id="dd-phone"
                          type="tel"
                          placeholder="+61..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="dd-month">Preferred month</label>
                      <select
                        className="form-input"
                        id="dd-month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a departure month
                        </option>
                        {destination.pricing?.map((p) => (
                          <option key={p.month}>{p.month} — {p.display}</option>
                        ))}
                        {destination.packages?.map((p) => (
                          <option key={p.id}>September — {p.name} ({p.priceDisplay})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="dd-trav">Travellers</label>
                      <select
                        className="form-input"
                        id="dd-trav"
                        value={travellers}
                        onChange={(e) => setTravellers(e.target.value)}
                      >
                        <option>2 adults</option>
                        <option>1 adult</option>
                        <option>2 adults + children</option>
                        <option>Family (4+)</option>
                        <option>Group (6+)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="dd-req">Special requests</label>
                      <textarea
                        className="form-input"
                        id="dd-req"
                        rows={3}
                        placeholder="Honeymoon, dietary needs, accessibility, etc."
                        style={{ resize: "vertical" }}
                        value={requests}
                        onChange={(e) => setRequests(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="inquiry-divider"></div>
                    <div className="inquiry-includes">
                      <div className="inc-item">No booking fees charged</div>
                      <div className="inc-item">Expert consultation included</div>
                      <div className="inc-item">{destination.transfersIncluded}</div>
                      <div className="inc-item">Enquire for pricing</div>
                    </div>

                    {ddStatus === "error" && (
                      <div
                        role="alert"
                        style={{ color: "#c0392b", fontSize: 13, margin: "10px 0 0" }}
                      >
                        Sorry, something went wrong. Please try again, or contact us
                        directly.
                      </div>
                    )}

                    <div className="inquiry-btns">
                      <button
                        type="submit"
                        className="btn btn-gold"
                        style={{ width: "100%", justifyContent: "center", padding: 15 }}
                        disabled={ddStatus === "submitting"}
                      >
                        {ddStatus === "submitting" ? "Sending…" : "Get My Free Quote ↗"}
                      </button>
                      <Link
                        to="/contact#inquiry-section"
                        className="btn btn-outline"
                        style={{ width: "100%", justifyContent: "center", padding: 14 }}
                      >
                        ✦ Talk to a Specialist
                      </Link>
                    </div>

                    <div className="inquiry-trust">
                      <span className="itrust">Secure enquiry</span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          color: "var(--stone-dark)",
                        }}
                      >
                        Reply within 2 working hours
                      </span>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
