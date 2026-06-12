import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { UMRAH_CITIES } from "../data/umrah";
import "./ContactPage.css";

type Step = 1 | 2 | 3 | 4;

const DEST_OPTIONS = [
  { key: "Maldives", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&q=70" },
  { key: "Kenya", img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=300&q=70" },
  { key: "Bali", img: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=300&q=70" },
];

const TRIP_TYPES = [
  "🏖 Beach",
  "🦁 Safari",
  "💍 Honeymoon",
  "🏛 Cultural",
  "⛰ Adventure",
  "🧘 Wellness",
  "👨‍👩‍👧 Family",
  "🌿 Eco",
];

const HOURS = [
  { day: "Monday", time: "9:00am – 7:00pm" },
  { day: "Tuesday", time: "9:00am – 7:00pm" },
  { day: "Wednesday", time: "9:00am – 7:00pm" },
  { day: "Thursday", time: "9:00am – 7:00pm" },
  { day: "Friday", time: "9:00am – 7:00pm" },
  { day: "Saturday", time: "9:00am – 5:00pm" },
  { day: "Sunday", time: "Closed" },
];

function isOpenNow(date = new Date()): boolean {
  const day = date.getDay(); // 0 = Sun
  const hour = date.getHours();
  if (day === 0) return false;
  if (day === 6) return hour >= 9 && hour < 17;
  return hour >= 9 && hour < 19;
}

export function ContactPage() {
  const [step, setStep] = useState<Step>(1);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // Holiday-specific
  const [destinations, setDestinations] = useState<Set<string>>(new Set());
  const [otherDest, setOtherDest] = useState("");
  const [budget, setBudget] = useState(3500);
  const [tripTypes, setTripTypes] = useState<Set<string>>(new Set(["💍 Honeymoon"]));
  // Destination tab
  const [destTab, setDestTab] = useState<"holiday" | "umrah">("holiday");
  // Umrah-specific
  const [umrahCity, setUmrahCity] = useState("");
  const [umrahTier, setUmrahTier] = useState("");
  const [umrahRoomType, setUmrahRoomType] = useState("Quad");
  const [umrahDeparture, setUmrahDeparture] = useState("");
  const [pilgrims, setPilgrims] = useState(4);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [activeChannel, setActiveChannel] = useState("inquiry-section");

  const selectedCityPkgs = UMRAH_CITIES.find((c) => c.id === umrahCity)?.packages ?? [];
  const umrahAvailableDates = [
    ...new Set(selectedCityPkgs.flatMap((p) => p.departureDates ?? [])),
  ];

  const today = useMemo(() => new Date(), []);
  const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const open = useMemo(() => isOpenNow(today), [today]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const toggleDest = (k: string) =>
    setDestinations((p) => {
      const n = new Set(p);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  const toggleType = (t: string) =>
    setTripTypes((p) => {
      const n = new Set(p);
      if (n.has(t)) n.delete(t);
      else n.add(t);
      return n;
    });

  const scrollToSection = (id: string) => {
    setActiveChannel(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitInquiry = () => {
    if (!consent) {
      alert("Please confirm consent to continue.");
      return;
    }
    setStep(4);
  };

  return (
    <>
      <div className="cp-page-hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80"
            alt="Farland travel"
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="cp-hero-content">
          <div className="cp-breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Get in Touch</span>
          </div>
          <div className="cp-hero-eyebrow">Start your journey</div>
          <h1 className="cp-hero-title">
            Let's Plan Your
            <br />
            <em>Perfect Trip</em>
          </h1>
          <p className="cp-hero-sub">
            Our travel specialists are ready to craft a journey built entirely around
            you. No templates, no package tours — just expert advice and bespoke planning.
          </p>
          <div className="cp-hero-badges">
            <div className="cp-hero-badge">
              <strong>Reply</strong> within 2 hours
            </div>
            <div className="cp-hero-badge">
              <strong>No</strong> booking fees
            </div>
            <div className="cp-hero-badge">
              <strong>Free</strong> consultation
            </div>
            <div className="cp-hero-badge">
              <strong>Protected</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="channels-bar">
        <div className="channels-inner">
          <button
            type="button"
            className={`channel-tab ${activeChannel === "inquiry-section" ? "active" : ""}`}
            onClick={() => scrollToSection("inquiry-section")}
          >
            <span className="ct-icon">📋</span> Full Enquiry
          </button>
          <button
            type="button"
            className={`channel-tab ${activeChannel === "whatsapp-section" ? "active" : ""}`}
            onClick={() => scrollToSection("whatsapp-section")}
          >
            <span className="ct-icon" style={{ color: "#25D366" }}>
              💬
            </span>{" "}
            WhatsApp
          </button>
        </div>
      </div>

      <div className="cp-page-body">
        {/* INQUIRY SECTION */}
        <section id="inquiry-section">
          <div className="inquiry-form-card reveal">
            <div className="form-card-header">
              <h3>Plan Your Dream Holiday</h3>
              <p>
                Tell us your vision — we'll handle every detail from flights to
                experiences. Completely free, no obligation.
              </p>
              <div className="reply-badge">
                <div className="reply-dot"></div>
                <span>Team online · Typical reply in 2 hours</span>
              </div>
            </div>

            <div className="form-card-body">
              <div className="step-indicator">
                <div className={`step ${step === 1 ? "active" : step > 1 ? "done" : ""}`}>
                  <div className="step-dot">{step > 1 ? "✓" : 1}</div>
                  <div className="step-label">You</div>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>
                  <div className="step-dot">{step > 2 ? "✓" : 2}</div>
                  <div className="step-label">Destination</div>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step === 3 ? "active" : step > 3 ? "done" : ""}`}>
                  <div className="step-dot">{step > 3 ? "✓" : 3}</div>
                  <div className="step-label">Details</div>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step === 4 ? "active" : ""}`}>
                  <div className="step-dot">4</div>
                  <div className="step-label">Done</div>
                </div>
              </div>

              {step === 1 && (
                <div className="form-panel">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-first">First name *</label>
                      <div className="input-wrap">
                        <span className="input-icon">👤</span>
                        <input
                          className="form-input"
                          id="inq-first"
                          type="text"
                          placeholder="Your first name"
                          value={first}
                          onChange={(e) => setFirst(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-last">Last name *</label>
                      <div className="input-wrap">
                        <span className="input-icon">👤</span>
                        <input
                          className="form-input"
                          id="inq-last"
                          type="text"
                          placeholder="Your last name"
                          value={last}
                          onChange={(e) => setLast(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="inq-email">Email address *</label>
                    <div className="input-wrap">
                      <span className="input-icon">✉</span>
                      <input
                        className={`form-input ${
                          email ? (emailValid ? "valid" : "error") : ""
                        }`}
                        id="inq-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {email && !emailValid && (
                      <div className="field-msg err show">Please enter a valid email</div>
                    )}
                    {email && emailValid && (
                      <div className="field-msg ok show">✓ Looks good</div>
                    )}
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-phone">Phone number *</label>
                      <div className="input-wrap">
                        <span className="input-icon">📞</span>
                        <input
                          className="form-input"
                          id="inq-phone"
                          type="tel"
                          placeholder="+44 7700 900000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-prefer">Preferred contact</label>
                      <select className="form-select" id="inq-prefer" defaultValue="Email">
                        <option>Email</option>
                        <option>Phone call</option>
                        <option>WhatsApp</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-submit btn-navy-full"
                    disabled={!first || !last || !emailValid || !phone}
                    onClick={() => setStep(2)}
                  >
                    Continue — Choose Destination →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="form-panel">
                  {/* Tab toggle: Holiday vs Umrah */}
                  <div className="dest-type-toggle">
                    <button
                      type="button"
                      className={`dest-type-btn ${destTab === "holiday" ? "active" : ""}`}
                      onClick={() => setDestTab("holiday")}
                    >
                      🌍 Holiday Destinations
                    </button>
                    <button
                      type="button"
                      className={`dest-type-btn ${destTab === "umrah" ? "active" : ""}`}
                      onClick={() => setDestTab("umrah")}
                    >
                      🕋 Umrah Packages
                    </button>
                  </div>

                  {destTab === "holiday" && (
                    <>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          color: "var(--stone-dark)",
                          marginBottom: 16,
                          lineHeight: 1.6,
                        }}
                      >
                        Select your dream destination or destinations — you can choose more than one:
                      </p>
                      <div className="dest-selector">
                        {DEST_OPTIONS.map((d) => (
                          <div
                            key={d.key}
                            className={`dest-opt ${destinations.has(d.key) ? "selected" : ""}`}
                            onClick={() => toggleDest(d.key)}
                          >
                            <img src={d.img} alt={d.key} />
                            <div className="dest-opt-overlay"></div>
                            <div className="dest-opt-label">{d.key}</div>
                            <div className="dest-opt-check">✓</div>
                          </div>
                        ))}
                        <div
                          className={`dest-opt other-dest ${
                            destinations.has("Other") ? "selected" : ""
                          }`}
                          onClick={() => toggleDest("Other")}
                        >
                          <div style={{ textAlign: "center", padding: 12 }}>
                            <div style={{ fontSize: 24, marginBottom: 4 }}>🌍</div>
                            <div
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 11,
                                color: "rgba(255,255,255,.7)",
                                fontWeight: 600,
                                letterSpacing: ".08em",
                                textTransform: "uppercase",
                              }}
                            >
                              Other / Not sure
                            </div>
                          </div>
                          <div className="dest-opt-check">✓</div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="inq-other">Or type a destination</label>
                        <div className="input-wrap">
                          <span className="input-icon">🗺</span>
                          <input
                            className="form-input"
                            id="inq-other"
                            type="text"
                            placeholder="e.g. Santorini, Rajasthan, Seychelles…"
                            value={otherDest}
                            onChange={(e) => setOtherDest(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {destTab === "umrah" && (
                    <>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          color: "var(--stone-dark)",
                          marginBottom: 16,
                          lineHeight: 1.6,
                        }}
                      >
                        Select your departure city for Umrah — September 2026:
                      </p>
                      <div className="umrah-city-grid">
                        {UMRAH_CITIES.map((city) => {
                          const fromPkg = city.packages.reduce(
                            (lo, p) => (p.price < lo.price ? p : lo),
                            city.packages[0],
                          );
                          return (
                            <div
                              key={city.id}
                              className={`umrah-city-card ${umrahCity === city.id ? "selected" : ""}`}
                              onClick={() => setUmrahCity(city.id)}
                            >
                              <div className="ucc-check">✓</div>
                              <span className="ucc-icon">🕋</span>
                              <div className="ucc-name">{city.city}</div>
                              <div className="ucc-count">
                                {city.packages.length} packages
                              </div>
                              <div className="ucc-price">
                                From {fromPkg.priceDisplay}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button
                      type="button"
                      className="btn-submit btn-outline-full"
                      style={{ maxWidth: 100, padding: 12 }}
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="btn-submit btn-navy-full"
                      disabled={destTab === "umrah" && !umrahCity}
                      onClick={() => setStep(3)}
                    >
                      {destTab === "umrah"
                        ? "Continue — Umrah Details →"
                        : "Continue — Travel Details →"}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && destTab === "umrah" && (
                <div className="form-panel">
                  {/* City summary banner */}
                  <div className="umrah-enquiry-city">
                    <span>🕋</span>
                    <div>
                      <div>Departure city</div>
                      <strong>
                        {UMRAH_CITIES.find((c) => c.id === umrahCity)?.city}
                      </strong>
                    </div>
                    <button type="button" onClick={() => setStep(2)}>
                      Change
                    </button>
                  </div>

                  {/* Package tier */}
                  <div className="form-group">
                    <label className="form-label">Package tier preference</label>
                    <div className="type-chips">
                      {["💼 Economy", "⭐ Premium", "👑 VIP", "No preference"].map((t) => {
                        const key = t.replace(/^[^\s]+ /, "").trim();
                        return (
                          <div
                            key={t}
                            className={`type-chip ${umrahTier === key ? "on" : ""}`}
                            onClick={() => setUmrahTier(umrahTier === key ? "" : key)}
                          >
                            {t}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Room sharing */}
                  <div className="form-group">
                    <label className="form-label">Room sharing preference</label>
                    <div className="umrah-room-chips">
                      {(
                        [
                          { key: "Quad", desc: "4 per room · most affordable" },
                          { key: "Triple", desc: "3 per room" },
                          { key: "Double", desc: "2 per room · most privacy" },
                        ] as const
                      ).map(({ key, desc }) => (
                        <div
                          key={key}
                          className={`umrah-room-chip ${umrahRoomType === key ? "on" : ""}`}
                          onClick={() => setUmrahRoomType(key)}
                        >
                          <div className="urc-name">{key}</div>
                          <div className="urc-desc">{desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Departure dates from selected city */}
                  {umrahAvailableDates.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">Preferred departure date</label>
                      <div className="type-chips">
                        {umrahAvailableDates.map((date) => (
                          <div
                            key={date}
                            className={`type-chip ${umrahDeparture === date ? "on" : ""}`}
                            onClick={() =>
                              setUmrahDeparture(umrahDeparture === date ? "" : date)
                            }
                          >
                            📅 {date}
                          </div>
                        ))}
                        <div
                          className={`type-chip ${umrahDeparture === "flexible" ? "on" : ""}`}
                          onClick={() =>
                            setUmrahDeparture(
                              umrahDeparture === "flexible" ? "" : "flexible",
                            )
                          }
                        >
                          Flexible
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pilgrims + Duration */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-pilgrims">
                        Number of pilgrims
                      </label>
                      <div className="input-wrap">
                        <span className="input-icon">👥</span>
                        <input
                          className="form-input"
                          id="inq-pilgrims"
                          type="number"
                          min={1}
                          max={20}
                          value={pilgrims}
                          onChange={(e) => setPilgrims(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-umrah-dur">
                        Package duration
                      </label>
                      <select
                        className="form-select"
                        id="inq-umrah-dur"
                        defaultValue="10 nights"
                      >
                        <option>7 nights</option>
                        <option>10 nights</option>
                        <option>14 nights</option>
                        <option>Any duration</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="inq-umrah-msg">
                      Special requests / questions
                    </label>
                    <textarea
                      className="form-textarea"
                      id="inq-umrah-msg"
                      placeholder="Accessibility needs, group requirements, room preferences, or anything else about your pilgrimage…"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="consent-row">
                    <input
                      type="checkbox"
                      id="inq-consent-u"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <label htmlFor="inq-consent-u">
                      I agree to be contacted by Farland Holidays regarding my enquiry
                      and confirm I have read the{" "}
                      <a href="#privacy">Privacy Policy</a>. I can unsubscribe at any
                      time.
                    </label>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      className="btn-submit btn-outline-full"
                      style={{ maxWidth: 100, padding: 12 }}
                      onClick={() => setStep(2)}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="btn-submit btn-gold-full"
                      onClick={submitInquiry}
                    >
                      🕋 Send Umrah Enquiry →
                    </button>
                  </div>
                  <div className="trust-row">
                    <div className="trust-item">🔒 <span>Secure &amp; confidential</span></div>
                    <div className="trust-item">⚡ <span>Reply in 2 hours</span></div>
                    <div className="trust-item">💰 <span>No booking fees</span></div>
                    <div className="trust-item">🛡 <span>Fully protected</span></div>
                  </div>
                </div>
              )}

              {step === 3 && destTab === "holiday" && (
                <div className="form-panel">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-date">Departure date</label>
                      <div className="input-wrap">
                        <span className="input-icon">📅</span>
                        <input className="form-input" id="inq-date" type="date" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-dur">Duration</label>
                      <select className="form-select" id="inq-dur" defaultValue="7 nights">
                        <option>7 nights</option>
                        <option>10 nights</option>
                        <option>14 nights</option>
                        <option>3 weeks+</option>
                        <option>Flexible</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-adults">Adults</label>
                      <div className="input-wrap">
                        <span className="input-icon">👥</span>
                        <input
                          className="form-input"
                          id="inq-adults"
                          type="number"
                          min={1}
                          max={20}
                          defaultValue={2}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="inq-kids">
                        Children (under 16)
                      </label>
                      <div className="input-wrap">
                        <span className="input-icon">🧒</span>
                        <input
                          className="form-input"
                          id="inq-kids"
                          type="number"
                          min={0}
                          max={10}
                          defaultValue={0}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Budget per person —{" "}
                      <span style={{ color: "var(--navy)", fontWeight: 600 }}>
                        £{budget.toLocaleString()}
                      </span>
                    </label>
                    <input
                      type="range"
                      min={500}
                      max={15000}
                      value={budget}
                      step={100}
                      onChange={(e) => setBudget(Number(e.target.value))}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--stone-dark)",
                        marginTop: 6,
                      }}
                    >
                      <span>£500</span>
                      <span>£15,000+</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trip type</label>
                    <div className="type-chips">
                      {TRIP_TYPES.map((t) => (
                        <div
                          key={t}
                          className={`type-chip ${tripTypes.has(t) ? "on" : ""}`}
                          onClick={() => toggleType(t)}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: 18 }}>
                    <label className="form-label" htmlFor="inq-msg">
                      Message / special requests
                    </label>
                    <textarea
                      className="form-textarea"
                      id="inq-msg"
                      placeholder="Tell us what makes this trip special — anniversary, honeymoon, bucket list item, dietary needs, accessibility, or anything else we should know…"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="consent-row">
                    <input
                      type="checkbox"
                      id="inq-consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <label htmlFor="inq-consent">
                      I agree to be contacted by Farland Holidays regarding my enquiry
                      and confirm I have read the <a href="#privacy">Privacy Policy</a>.
                      I can unsubscribe at any time.
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      className="btn-submit btn-outline-full"
                      style={{ maxWidth: 100, padding: 12 }}
                      onClick={() => setStep(2)}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="btn-submit btn-gold-full"
                      onClick={submitInquiry}
                    >
                      ✦ Send My Enquiry →
                    </button>
                  </div>
                  <div className="trust-row">
                    <div className="trust-item">🔒 <span>Secure &amp; confidential</span></div>
                    <div className="trust-item">⚡ <span>Reply in 2 hours</span></div>
                    <div className="trust-item">💰 <span>No booking fees</span></div>
                    <div className="trust-item">🛡 <span>Fully protected</span></div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="success-overlay">
                  <div className="success-check">✅</div>
                  <h3>Enquiry Sent!</h3>
                  <p>
                    Thank you — your enquiry has been received. A member of our team will
                    be in touch within 2 working hours.{" "}
                    In the meantime, why not explore our{" "}
                    <Link to="/deals" style={{ color: "var(--gold)" }}>
                      latest deals
                    </Link>
                    ?
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="inquiry-sidebar">
            <div className="contact-card reveal reveal-delay-1">
              <div className="contact-card-header">
                <h4>Other ways to reach us</h4>
                <p>Choose how you'd like to get in touch</p>
              </div>
              <div className="contact-card-body">
                <a href="tel:+448001234567" className="contact-channel">
                  <div className="ch-icon phone">📞</div>
                  <div className="ch-text">
                    <span className="ch-label">Call us</span>
                    <span className="ch-value">+44 800 123 4567</span>
                    <span className="ch-sub">Mon–Fri 9am–7pm · Sat 9am–5pm</span>
                  </div>
                  <span className="ch-arrow">→</span>
                </a>
                <a href="mailto:hello@farlandholidays.com" className="contact-channel">
                  <div className="ch-icon email">✉</div>
                  <div className="ch-text">
                    <span className="ch-label">Email us</span>
                    <span className="ch-value">hello@farlandholidays.com</span>
                    <span className="ch-sub">Reply within 2 working hours</span>
                  </div>
                  <span className="ch-arrow">→</span>
                </a>
                <a
                  href="https://wa.me/44800123456?text=Hi%20Farland%20Holidays%2C%20I'm%20interested%20in%20planning%20a%20trip."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-channel"
                >
                  <div className="ch-icon wa">💬</div>
                  <div className="ch-text">
                    <span className="ch-label">WhatsApp</span>
                    <span className="ch-value">Message us instantly</span>
                    <span className="ch-sub">Usually replies within minutes</span>
                  </div>
                  <span className="ch-arrow">→</span>
                </a>
              </div>
            </div>

            <div className="hours-card reveal reveal-delay-3">
              <div className="hours-header">
                <h4>Opening Hours</h4>
                <span className={`open-badge ${open ? "" : "closed"}`}>
                  {open ? "Open Now" : "Closed"}
                </span>
              </div>
              <div className="hours-grid">
                {HOURS.map((h, i) => {
                  const isToday = i === todayIdx;
                  return (
                    <span key={h.day} style={{ display: "contents" }}>
                      <span className={`hours-day ${isToday ? "today" : ""}`}>
                        {h.day}
                        {isToday ? " (today)" : ""}
                      </span>
                      <span
                        className={`hours-time ${isToday ? "today" : ""}`}
                        style={h.time === "Closed" ? { color: "var(--stone)" } : undefined}
                      >
                        {h.time}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* WHATSAPP */}
        <section id="whatsapp-section" className="reveal">
          <div className="cp-section-eyebrow">03 — Instant messaging</div>
          <h2 className="cp-section-title">Chat on WhatsApp</h2>
          <p className="cp-section-sub">
            Prefer to chat? Our specialists are on WhatsApp — just tap to start a
            conversation.
          </p>

          <div className="wa-card">
            <div className="wa-info">
              <div className="wa-badge">
                <span style={{ fontSize: 22 }}>💬</span>
                <span>WhatsApp Business</span>
              </div>
              <h3>
                Plan Your Trip
                <br />
                in a Chat
              </h3>
              <p>
                No forms, no waiting on hold. Message us on WhatsApp and a real travel
                specialist will reply — usually within minutes during business hours.
              </p>

              <div className="wa-benefits">
                <div className="wa-benefit">
                  <div className="wa-b-icon">⚡</div>
                  <div className="wa-b-text">
                    <h5>Instant response</h5>
                    <p>Average reply time under 5 minutes during business hours.</p>
                  </div>
                </div>
                <div className="wa-benefit">
                  <div className="wa-b-icon">🔒</div>
                  <div className="wa-b-text">
                    <h5>End-to-end encrypted</h5>
                    <p>Your conversations are always private and fully secure.</p>
                  </div>
                </div>
                <div className="wa-benefit">
                  <div className="wa-b-icon">📎</div>
                  <div className="wa-b-text">
                    <h5>Share photos &amp; ideas</h5>
                    <p>
                      Send us hotel photos, Pinterest boards, or inspiration — we'll
                      build around it.
                    </p>
                  </div>
                </div>
                <div className="wa-benefit">
                  <div className="wa-b-icon">🌍</div>
                  <div className="wa-b-text">
                    <h5>On-trip support</h5>
                    <p>
                      24/7 emergency support while you're travelling — we're always
                      there.
                    </p>
                  </div>
                </div>
              </div>

              <div className="wa-btns">
                <a
                  href="https://wa.me/44800123456?text=Hi%20Farland%20Holidays!%20I'd%20love%20to%20plan%20a%20trip."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-submit btn-gold-full"
                  style={{ maxWidth: 260, textDecoration: "none" }}
                >
                  💬 Open WhatsApp Chat
                </a>
                <a
                  href="https://wa.me/44800123456?text=Hi!%20I'd%20like%20a%20quick%20quote."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-submit btn-outline-full"
                  style={{ maxWidth: 200, textDecoration: "none" }}
                >
                  Quick Quote via WA
                </a>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--stone-dark)",
                  marginTop: 14,
                }}
              >
                WhatsApp number:{" "}
                <strong style={{ color: "var(--navy)" }}>+44 800 123 4567</strong> ·
                Mon–Sat 9am–7pm
              </p>
            </div>

            <div className="wa-preview">
              <div className="phone-mockup">
                <div className="phone-statusbar">
                  <span className="phone-time">9:41</span>
                  <span className="phone-icons">●●●</span>
                </div>
                <div className="wa-chat-header">
                  <div className="wa-chat-avatar">F</div>
                  <div>
                    <span className="wa-chat-name">Farland Holidays</span>
                    <span className="wa-chat-status">● Online</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="chat-bubble received">
                    Hi! 👋 Welcome to Farland. How can we help plan your perfect trip?
                    <div className="chat-time">9:41</div>
                  </div>
                  <div className="chat-bubble sent">
                    Hi, I'd love to plan a honeymoon to the Maldives in December!
                    <div className="chat-time">9:42</div>
                  </div>
                  <div className="chat-bubble received">
                    Wonderful choice! ✨ What's your approximate budget per person?
                    <div className="chat-time">9:42</div>
                  </div>
                  <div className="chat-bubble sent">
                    Around £3,500–£4,500 each.
                    <div className="chat-time">9:43</div>
                  </div>
                  <div className="chat-bubble received">
                    Perfect — I have 3 stunning overwater villa options for you. Sending
                    now…
                    <div className="chat-time">9:43</div>
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--stone-dark)",
                  marginTop: 16,
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Real conversation example
                <br />
                Names changed for privacy
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
