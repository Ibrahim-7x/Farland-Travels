import type { Draft } from "../pages/PackageFormPage";
import { Editable } from "./InlineEdit";

type Props = {
  draft: Draft;
  set: <K extends keyof Draft>(key: K, value: Draft[K]) => void;
};

const INCLUSIONS: { key: string; icon: string; label: string }[] = [
  { key: "visa", icon: "🛂", label: "Umrah visa" },
  { key: "flights", icon: "✈️", label: "Return flights" },
  { key: "transfers", icon: "🚌", label: "All transfers" },
  { key: "breakfast", icon: "🍳", label: "Daily breakfast" },
  { key: "ziyarah", icon: "🕌", label: "Ziyarah tours" },
  { key: "guide", icon: "👥", label: "Guided group" },
];

const TIERS = ["", "Economy", "Premium", "VIP"];

/** The Umrah package rendered as its public-facing detail, editable in place. */
export function PackageInlineEditor({ draft, set }: Props) {
  const toggleInclusion = (key: string) =>
    set(
      "inclusions",
      draft.inclusions.includes(key)
        ? draft.inclusions.filter((k) => k !== key)
        : [...draft.inclusions, key],
    );

  const dates = draft.departureDates;
  const setDates = (arr: string[]) => set("departureDates", arr);

  const rates = draft.roomRates;
  const updRate = (i: number, f: "room" | "priceDisplay", v: string) =>
    set("roomRates", rates.map((r, idx) => (idx === i ? { ...r, [f]: v } : r)));
  const addRate = () => set("roomRates", [...rates, { room: "", priceDisplay: "" }]);
  const rmRate = (i: number) =>
    set("roomRates", rates.filter((_, idx) => idx !== i));

  return (
    <div className="iedeal-canvas">
      {/* ── HEADER ── */}
      <section className="iedeal-hero" style={{ minHeight: 240 }}>
        <div className="iedeal-hero-overlay" />
        <div className="iedeal-hero-actions">
          <div className="ie-tier" role="group" aria-label="Tier">
            {TIERS.map((t) => (
              <button
                type="button"
                key={t || "none"}
                className={draft.tier === t ? "on" : ""}
                onClick={() => set("tier", t)}
              >
                {t || "No tier"}
              </button>
            ))}
          </div>
        </div>
        <div className="iedeal-hero-content">
          <div className="iedeal-hero-region">
            <Editable
              className="ie-on-dark"
              value={draft.city}
              onChange={(v) => set("city", v)}
              placeholder="Departure city"
              ariaLabel="City"
            />
          </div>
          <Editable
            className="iedeal-hero-title ie-on-dark"
            value={draft.name}
            onChange={(v) => set("name", v)}
            placeholder="Package name (e.g. 10-Night Signature Umrah)"
            ariaLabel="Package name"
          />
          <div className="iedeal-meta-row">
            <span className="iedeal-meta">
              <span className="dot" />
              <Editable
                className="ie-on-dark iedeal-meta-strong"
                value={draft.stars}
                onChange={(v) => set("stars", v)}
                placeholder="5 Star"
                ariaLabel="Stars"
              />
            </span>
            <span className="iedeal-meta">
              <span className="dot" />
              <Editable
                className="ie-on-dark iedeal-meta-strong"
                value={draft.nights}
                onChange={(v) => set("nights", v)}
                placeholder="10 nights"
                ariaLabel="Nights"
              />
            </span>
            <span className="iedeal-meta">
              <span className="dot" />
              <Editable
                className="ie-on-dark"
                value={draft.roomType}
                onChange={(v) => set("roomType", v)}
                placeholder="Quad"
                ariaLabel="Room type"
              />
            </span>
            <span className="iedeal-meta">
              <span className="dot" />
              <Editable
                className="ie-on-dark"
                value={draft.month}
                onChange={(v) => set("month", v)}
                placeholder="September"
                ariaLabel="Month"
              />
            </span>
          </div>
          <div className="iedeal-hero-price">
            From
            <Editable
              className="ie-on-dark"
              value={draft.priceDisplay}
              onChange={(v) => set("priceDisplay", v)}
              placeholder="A$1,675"
              ariaLabel="Price display"
            />
            per person
          </div>
        </div>
      </section>

      {/* ── HOTELS ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">Hotels</div>

        <div className="iedeal-hotel">
          <div className="iedeal-hotel-head">
            <span className="iedeal-hotel-city">🕋</span>
            <div className="iedeal-hotel-name" style={{ flex: 1 }}>
              <Editable
                value={draft.makkahHotel}
                onChange={(v) => set("makkahHotel", v)}
                placeholder="Makkah hotel name"
                ariaLabel="Makkah hotel"
              />
            </div>
          </div>
          <div className="iedeal-hotel-meta">
            <span>
              🌙
              <Editable
                value={draft.makkahNights}
                onChange={(v) => set("makkahNights", v)}
                placeholder="6 nights"
                ariaLabel="Makkah nights"
              />
            </span>
            <span>
              ⭐
              <Editable
                value={draft.makkahRating}
                onChange={(v) => set("makkahRating", v)}
                placeholder="4.8"
                ariaLabel="Makkah rating"
              />
            </span>
            <span>
              📍
              <Editable
                value={draft.makkahDistance}
                onChange={(v) => set("makkahDistance", v)}
                placeholder="≈300 m from the Haram"
                ariaLabel="Makkah distance"
              />
            </span>
          </div>
        </div>

        <div className="iedeal-hotel">
          <div className="iedeal-hotel-head">
            <span className="iedeal-hotel-city">🕌</span>
            <div className="iedeal-hotel-name" style={{ flex: 1 }}>
              <Editable
                value={draft.madinahHotel}
                onChange={(v) => set("madinahHotel", v)}
                placeholder="Madinah hotel name"
                ariaLabel="Madinah hotel"
              />
            </div>
          </div>
          <div className="iedeal-hotel-meta">
            <span>
              🌙
              <Editable
                value={draft.madinahNights}
                onChange={(v) => set("madinahNights", v)}
                placeholder="4 nights"
                ariaLabel="Madinah nights"
              />
            </span>
            <span>
              ⭐
              <Editable
                value={draft.madinahRating}
                onChange={(v) => set("madinahRating", v)}
                placeholder="4.6"
                ariaLabel="Madinah rating"
              />
            </span>
            <span>
              📍
              <Editable
                value={draft.madinahDistance}
                onChange={(v) => set("madinahDistance", v)}
                placeholder="≈250 m from Masjid an-Nabawi"
                ariaLabel="Madinah distance"
              />
            </span>
          </div>
        </div>
      </section>

      {/* ── INCLUSIONS ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">What's included</div>
        <div className="ie-chip-row">
          {INCLUSIONS.map((inc) => {
            const on = draft.inclusions.includes(inc.key);
            return (
              <button
                type="button"
                key={inc.key}
                className={`ie-chip ${on ? "on" : ""}`}
                aria-pressed={on}
                onClick={() => toggleInclusion(inc.key)}
              >
                <span>{inc.icon}</span>
                {inc.label}
                <span className="tick">✓</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── FLIGHT ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">Flight</div>
        <div className="iedeal-comp" style={{ borderBottom: "none", paddingRight: 0 }}>
          <Editable
            className="lbl"
            value={draft.flightAirline}
            onChange={(v) => set("flightAirline", v)}
            placeholder="Qatar Airways"
            ariaLabel="Airline"
          />
          <Editable
            className="det"
            value={draft.flightRouting}
            onChange={(v) => set("flightRouting", v)}
            placeholder="1 stop via Doha"
            ariaLabel="Routing"
          />
        </div>
      </section>

      {/* ── DEPARTURE DATES ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">Departure dates</div>
        {dates.map((d, i) => (
          <div className="iedeal-line" key={i}>
            <span>📅</span>
            <Editable
              value={d}
              onChange={(v) => setDates(dates.map((x, idx) => (idx === i ? v : x)))}
              placeholder="4 Sep 2026"
              ariaLabel="Departure date"
            />
            <button
              type="button"
              className="ie-remove"
              onClick={() => setDates(dates.filter((_, idx) => idx !== i))}
              aria-label="Remove date"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="iedeal-add"
          onClick={() => setDates([...dates, ""])}
        >
          + Add date
        </button>
      </section>

      {/* ── ROOM RATES ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">Room rates (optional)</div>
        {rates.map((r, i) => (
          <div className="iedeal-line" key={i}>
            <Editable
              className="lbl"
              value={r.room}
              onChange={(v) => updRate(i, "room", v)}
              placeholder="Quad"
              ariaLabel="Room"
            />
            <Editable
              className="det"
              value={r.priceDisplay}
              onChange={(v) => updRate(i, "priceDisplay", v)}
              placeholder="A$1,675"
              ariaLabel="Room price"
            />
            <button
              type="button"
              className="ie-remove"
              onClick={() => rmRate(i)}
              aria-label="Remove room rate"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="iedeal-add" onClick={addRate}>
          + Add room rate
        </button>
      </section>
    </div>
  );
}
