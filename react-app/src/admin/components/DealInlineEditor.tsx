import type { Draft } from "../pages/DealFormPage";
import { Editable, InlineImage } from "./InlineEdit";

type Props = {
  draft: Draft;
  set: <K extends keyof Draft>(key: K, value: Draft[K]) => void;
};

/**
 * Renders the deal exactly as its public detail page looks — hero, overview,
 * highlights, what's-included, monthly pricing, package options — but every
 * line is editable in place. The bottom "listing & search" panel (in
 * DealFormPage) holds the few fields that don't appear on the page itself.
 */
export function DealInlineEditor({ draft, set }: Props) {
  // ── list mutators ──
  const meta = draft.metaItems;
  const updMeta = (i: number, f: "strong" | "rest", v: string) =>
    set("metaItems", meta.map((x, idx) => (idx === i ? { ...x, [f]: v } : x)));
  const addMeta = () => set("metaItems", [...meta, { strong: "", rest: "" }]);
  const rmMeta = (i: number) => set("metaItems", meta.filter((_, idx) => idx !== i));

  const hl = draft.highlights;
  const updHl = (i: number, f: "icon" | "title" | "text", v: string) =>
    set("highlights", hl.map((x, idx) => (idx === i ? { ...x, [f]: v } : x)));
  const addHl = () =>
    set("highlights", [...hl, { icon: "", title: "", text: "" }]);
  const rmHl = (i: number) =>
    set("highlights", hl.filter((_, idx) => idx !== i));

  const comp = draft.components;
  const updComp = (i: number, f: "label" | "details", v: string) =>
    set("components", comp.map((x, idx) => (idx === i ? { ...x, [f]: v } : x)));
  const addComp = () => set("components", [...comp, { label: "", details: "" }]);
  const rmComp = (i: number) =>
    set("components", comp.filter((_, idx) => idx !== i));

  const pricing = draft.pricing;
  const updPrice = (
    i: number,
    f: "month" | "amount" | "currency" | "display",
    v: string,
  ) => set("pricing", pricing.map((x, idx) => (idx === i ? { ...x, [f]: v } : x)));
  const addPrice = () =>
    set("pricing", [
      ...pricing,
      { month: "", amount: "", currency: "AUD", display: "" },
    ]);
  const rmPrice = (i: number) =>
    set("pricing", pricing.filter((_, idx) => idx !== i));

  const pkgs = draft.packages;
  const updPkg = (i: number, f: keyof Draft["packages"][number], v: string) =>
    set("packages", pkgs.map((x, idx) => (idx === i ? { ...x, [f]: v } : x)));
  const addPkg = () =>
    set("packages", [
      ...pkgs,
      { id: "", name: "", stars: "", duration: "", hotels: "", roomType: "", priceDisplay: "" },
    ]);
  const rmPkg = (i: number) =>
    set("packages", pkgs.filter((_, idx) => idx !== i));

  const heroSrc = draft.heroImage || draft.image;

  return (
    <div className="iedeal-canvas">
      {/* ── HERO ── */}
      <section className="iedeal-hero">
        {heroSrc && <img className="iedeal-hero-bg" src={heroSrc} alt="" />}
        <div className="iedeal-hero-overlay" />
        <div className="iedeal-hero-actions">
          <InlineImage
            dark
            label={draft.heroImage ? "Change hero photo" : "Add hero photo"}
            onChange={(url) => set("heroImage", url)}
          />
        </div>
        <div className="iedeal-hero-content">
          <div className="iedeal-hero-region">
            <Editable
              className="ie-on-dark"
              value={draft.regionLabel}
              onChange={(v) => set("regionLabel", v)}
              placeholder="Region label"
              ariaLabel="Region label"
            />
            <span>·</span>
            <Editable
              className="ie-on-dark"
              value={draft.subtitle}
              onChange={(v) => set("subtitle", v)}
              placeholder="Subtitle"
              ariaLabel="Subtitle"
            />
          </div>
          <Editable
            className="iedeal-hero-title ie-on-dark"
            value={draft.name}
            onChange={(v) => set("name", v)}
            placeholder="Deal name"
            ariaLabel="Deal name"
          />
          <Editable
            multiline
            className="iedeal-hero-tagline ie-on-dark"
            value={draft.tagline}
            onChange={(v) => set("tagline", v)}
            placeholder="A one-line tagline for this deal"
            ariaLabel="Tagline"
          />
          <div className="iedeal-meta-row">
            {meta.map((m, i) => (
              <span className="iedeal-meta" key={i}>
                <span className="dot" />
                <Editable
                  className="ie-on-dark iedeal-meta-strong"
                  value={m.strong}
                  onChange={(v) => updMeta(i, "strong", v)}
                  placeholder="11"
                  ariaLabel="Meta value"
                />
                <Editable
                  className="ie-on-dark"
                  value={m.rest}
                  onChange={(v) => updMeta(i, "rest", v)}
                  placeholder="nights"
                  ariaLabel="Meta label"
                />
                <button
                  type="button"
                  className="ie-remove"
                  onClick={() => rmMeta(i)}
                  aria-label="Remove meta item"
                >
                  ✕
                </button>
              </span>
            ))}
            <button type="button" className="iedeal-add" onClick={addMeta}>
              + Add fact
            </button>
          </div>
          <div className="iedeal-hero-price">
            From
            <Editable
              className="ie-on-dark"
              value={draft.fromPrice}
              onChange={(v) => set("fromPrice", v)}
              placeholder="AUD $2,088"
              ariaLabel="From price"
            />
            per person
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">Overview</div>
        <Editable
          multiline
          className="iedeal-desc"
          value={draft.description}
          onChange={(v) => set("description", v)}
          placeholder="Describe the journey — what makes it special, what's the shape of the trip…"
          ariaLabel="Description"
        />

        <div className="iedeal-eyebrow" style={{ marginTop: 24 }}>
          Highlights
        </div>
        <div className="iedeal-hl-grid">
          {hl.map((h, i) => (
            <div className="iedeal-hl" key={i}>
              <div className="iedeal-hl-ic">
                <Editable
                  value={h.icon}
                  onChange={(v) => updHl(i, "icon", v)}
                  placeholder="✦"
                  ariaLabel="Highlight icon"
                />
              </div>
              <div className="iedeal-hl-body">
                <Editable
                  className="iedeal-hl-title"
                  value={h.title}
                  onChange={(v) => updHl(i, "title", v)}
                  placeholder="Highlight title"
                  ariaLabel="Highlight title"
                />
                <Editable
                  multiline
                  className="iedeal-hl-text"
                  value={h.text}
                  onChange={(v) => updHl(i, "text", v)}
                  placeholder="A sentence about this highlight."
                  ariaLabel="Highlight text"
                />
              </div>
              <button
                type="button"
                className="ie-remove"
                onClick={() => rmHl(i)}
                aria-label="Remove highlight"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="iedeal-add" onClick={addHl}>
          + Add highlight
        </button>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">What's included</div>
        {comp.map((c, i) => (
          <div className="iedeal-comp" key={i}>
            <Editable
              className="lbl"
              value={c.label}
              onChange={(v) => updComp(i, "label", v)}
              placeholder="Singapore Hotel"
              ariaLabel="Component label"
            />
            <Editable
              className="det"
              multiline
              value={c.details}
              onChange={(v) => updComp(i, "details", v)}
              placeholder="Furama Riverfront — Superior Room · Room Only · 04 Nights"
              ariaLabel="Component details"
            />
            <button
              type="button"
              className="ie-remove"
              onClick={() => rmComp(i)}
              aria-label="Remove component"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="iedeal-add" onClick={addComp}>
          + Add included item
        </button>
      </section>

      {/* ── MONTHLY PRICING ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">Pricing per month</div>
        <div className="iedeal-price-grid">
          {pricing.map((p, i) => (
            <div className="iedeal-price-card" key={i}>
              <div className="iedeal-price-month">
                <Editable
                  value={p.month}
                  onChange={(v) => updPrice(i, "month", v)}
                  placeholder="May"
                  ariaLabel="Month"
                />
              </div>
              <div className="iedeal-price-amt">
                <Editable
                  value={p.display}
                  onChange={(v) => updPrice(i, "display", v)}
                  placeholder="AUD $2,088"
                  ariaLabel="Price display"
                />
              </div>
              <div className="iedeal-price-sub">
                per person ·
                <Editable
                  value={p.currency}
                  onChange={(v) => updPrice(i, "currency", v)}
                  placeholder="AUD"
                  ariaLabel="Currency"
                />
              </div>
              <button
                type="button"
                className="ie-remove"
                onClick={() => rmPrice(i)}
                aria-label="Remove month"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="iedeal-add" onClick={addPrice}>
          + Add month
        </button>
      </section>

      {/* ── PACKAGE OPTIONS (optional) ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">Package options (optional)</div>
        {pkgs.length === 0 && (
          <p className="admin-muted" style={{ margin: "0 0 4px" }}>
            For multi-option deals (e.g. 7 / 10 / 12-night choices). Leave empty
            for a single-itinerary deal.
          </p>
        )}
        {pkgs.map((p, i) => (
          <div className="iedeal-subpkg" key={i}>
            <div className="iedeal-subpkg-grid">
              <label>
                Name
                <Editable
                  value={p.name}
                  onChange={(v) => updPkg(i, "name", v)}
                  placeholder="Package 1"
                  ariaLabel="Package name"
                />
              </label>
              <label>
                Stars
                <Editable
                  value={p.stars}
                  onChange={(v) => updPkg(i, "stars", v)}
                  placeholder="5 Star"
                  ariaLabel="Package stars"
                />
              </label>
              <label>
                Duration
                <Editable
                  value={p.duration}
                  onChange={(v) => updPkg(i, "duration", v)}
                  placeholder="7 Nights (4 Makkah + 3 Madinah)"
                  ariaLabel="Package duration"
                />
              </label>
              <label>
                Room type
                <Editable
                  value={p.roomType}
                  onChange={(v) => updPkg(i, "roomType", v)}
                  placeholder="Quad"
                  ariaLabel="Package room type"
                />
              </label>
              <label>
                Hotels
                <Editable
                  value={p.hotels}
                  onChange={(v) => updPkg(i, "hotels", v)}
                  placeholder="Anjum Hotel 5★ + Emaar Royal 5★"
                  ariaLabel="Package hotels"
                />
              </label>
              <label>
                Price
                <Editable
                  value={p.priceDisplay}
                  onChange={(v) => updPkg(i, "priceDisplay", v)}
                  placeholder="£1,475"
                  ariaLabel="Package price"
                />
              </label>
            </div>
            <button
              type="button"
              className="ie-remove"
              onClick={() => rmPkg(i)}
              aria-label="Remove package option"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="iedeal-add" onClick={addPkg}>
          + Add package option
        </button>
        {pkgs.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div className="iedeal-eyebrow">Packages note</div>
            <Editable
              className="iedeal-desc"
              value={draft.packagesNote}
              onChange={(v) => set("packagesNote", v)}
              placeholder="All three packages depart in September."
              ariaLabel="Packages note"
            />
          </div>
        )}
      </section>

      {/* ── TRANSFERS ── */}
      <section className="iedeal-section">
        <div className="iedeal-eyebrow">Transfers</div>
        <Editable
          className="iedeal-desc"
          value={draft.transfersIncluded}
          onChange={(v) => set("transfersIncluded", v)}
          placeholder="All ground transfers included"
          ariaLabel="Transfers"
        />
      </section>
    </div>
  );
}
