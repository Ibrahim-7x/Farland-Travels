import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../api";

const INCLUSIONS = ["visa", "flights", "transfers", "breakfast", "ziyarah", "guide"];
const TIERS = ["Economy", "Premium", "VIP"];
const BADGES = ["Best Seller", "Limited Seats", "Early Bird"];

type RoomRate = { room: string; priceDisplay: string };

type Draft = {
  city: string;
  stars: string;
  nights: string;
  roomType: string;
  month: string;
  makkahHotel: string;
  makkahNights: string;
  makkahRating: string;
  makkahDistance: string;
  madinahHotel: string;
  madinahNights: string;
  madinahRating: string;
  madinahDistance: string;
  price: string;
  priceDisplay: string;
  name: string;
  tier: string;
  departureDates: string;
  roomRates: RoomRate[];
  flightAirline: string;
  flightRouting: string;
  inclusions: string[];
  badge: string;
  mostPopular: boolean;
  isPublished: boolean;
};

const BLANK: Draft = {
  city: "",
  stars: "",
  nights: "",
  roomType: "Quad",
  month: "",
  makkahHotel: "",
  makkahNights: "",
  makkahRating: "",
  makkahDistance: "",
  madinahHotel: "",
  madinahNights: "",
  madinahRating: "",
  madinahDistance: "",
  price: "",
  priceDisplay: "",
  name: "",
  tier: "",
  departureDates: "",
  roomRates: [],
  flightAirline: "",
  flightRouting: "",
  inclusions: [],
  badge: "",
  mostPopular: false,
  isPublished: false,
};

type ApiPkg = {
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
  roomRates: RoomRate[] | null;
  flight: { airline: string; routing: string } | null;
  inclusions: string[] | null;
  badge: string | null;
  mostPopular: boolean;
  isPublished: boolean;
};

function fromApi(p: ApiPkg): Draft {
  return {
    city: p.city ?? "",
    stars: p.stars ?? "",
    nights: p.nights ?? "",
    roomType: p.roomType ?? "",
    month: p.month ?? "",
    makkahHotel: p.makkahHotel ?? "",
    makkahNights: p.makkahNights ?? "",
    makkahRating: p.makkahRating == null ? "" : String(p.makkahRating),
    makkahDistance: p.makkahDistance ?? "",
    madinahHotel: p.madinahHotel ?? "",
    madinahNights: p.madinahNights ?? "",
    madinahRating: p.madinahRating == null ? "" : String(p.madinahRating),
    madinahDistance: p.madinahDistance ?? "",
    price: p.price == null ? "" : String(p.price),
    priceDisplay: p.priceDisplay ?? "",
    name: p.name ?? "",
    tier: p.tier ?? "",
    departureDates: (p.departureDates ?? []).join("\n"),
    roomRates: (p.roomRates ?? []).map((r) => ({
      room: r.room,
      priceDisplay: r.priceDisplay,
    })),
    flightAirline: p.flight?.airline ?? "",
    flightRouting: p.flight?.routing ?? "",
    inclusions: p.inclusions ?? [],
    badge: p.badge ?? "",
    mostPopular: Boolean(p.mostPopular),
    isPublished: Boolean(p.isPublished),
  };
}

function toBody(d: Draft): Record<string, unknown> {
  return {
    city: d.city.trim(),
    stars: d.stars.trim(),
    nights: d.nights.trim(),
    roomType: d.roomType.trim(),
    month: d.month.trim() || null,
    makkahHotel: d.makkahHotel.trim() || null,
    makkahNights: d.makkahNights.trim() || null,
    makkahRating: d.makkahRating === "" ? null : Number(d.makkahRating),
    makkahDistance: d.makkahDistance.trim() || null,
    madinahHotel: d.madinahHotel.trim() || null,
    madinahNights: d.madinahNights.trim() || null,
    madinahRating: d.madinahRating === "" ? null : Number(d.madinahRating),
    madinahDistance: d.madinahDistance.trim() || null,
    price: Number(d.price),
    priceDisplay: d.priceDisplay.trim() || null,
    name: d.name.trim() || null,
    tier: d.tier || null,
    departureDates: d.departureDates
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    roomRates: d.roomRates.filter((r) => r.room.trim() && r.priceDisplay.trim()),
    flight:
      d.flightAirline.trim() && d.flightRouting.trim()
        ? { airline: d.flightAirline.trim(), routing: d.flightRouting.trim() }
        : null,
    inclusions: d.inclusions,
    badge: d.badge || null,
    mostPopular: d.mostPopular,
    isPublished: d.isPublished,
  };
}

export function PackageFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>(BLANK);
  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    apiGet<ApiPkg>(`/admin/umrah-packages/${id}`)
      .then((p) => setDraft(fromApi(p)))
      .catch(() => setErr("Could not load package."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const updateRate = (i: number, field: keyof RoomRate, value: string) =>
    setDraft((d) => {
      const roomRates = d.roomRates.map((r, idx) =>
        idx === i ? { ...r, [field]: value } : r,
      );
      return { ...d, roomRates };
    });
  const addRate = () =>
    setDraft((d) => ({ ...d, roomRates: [...d.roomRates, { room: "", priceDisplay: "" }] }));
  const removeRate = (i: number) =>
    setDraft((d) => ({ ...d, roomRates: d.roomRates.filter((_, idx) => idx !== i) }));

  const toggleInclusion = (key: string, on: boolean) =>
    setDraft((d) => ({
      ...d,
      inclusions: on
        ? [...d.inclusions, key]
        : d.inclusions.filter((k) => k !== key),
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const body = toBody(draft);
      if (isEdit) await apiPut(`/admin/umrah-packages/${id}`, body);
      else await apiPost("/admin/umrah-packages", body);
      navigate("/admin/packages");
    } catch (error) {
      setErr((error as Error).message || "Could not save package.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="admin-muted">Loading…</p>;

  return (
    <>
      <h1 className="admin-h1">{isEdit ? "Edit package" : "New package"}</h1>
      <p className="admin-sub">All AUD prices. Leave optional fields blank to hide them on the card.</p>

      <form className="admin-card" onSubmit={submit}>
        <div className="admin-row">
          <label className="admin-field">
            <span>City *</span>
            <input className="admin-input" value={draft.city} onChange={(e) => set("city", e.target.value)} required placeholder="Perth" />
          </label>
          <label className="admin-field">
            <span>Display name</span>
            <input className="admin-input" value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="10-Night Signature Umrah" />
          </label>
        </div>

        <div className="admin-row">
          <label className="admin-field">
            <span>Stars *</span>
            <input className="admin-input" value={draft.stars} onChange={(e) => set("stars", e.target.value)} required placeholder="5 Star" />
          </label>
          <label className="admin-field">
            <span>Nights *</span>
            <input className="admin-input" value={draft.nights} onChange={(e) => set("nights", e.target.value)} required placeholder="10 nights" />
          </label>
        </div>

        <div className="admin-row">
          <label className="admin-field">
            <span>Room type *</span>
            <input className="admin-input" value={draft.roomType} onChange={(e) => set("roomType", e.target.value)} required placeholder="Quad" />
          </label>
          <label className="admin-field">
            <span>Month</span>
            <input className="admin-input" value={draft.month} onChange={(e) => set("month", e.target.value)} placeholder="September" />
          </label>
        </div>

        <div className="admin-row">
          <label className="admin-field">
            <span>Tier</span>
            <select className="admin-select" value={draft.tier} onChange={(e) => set("tier", e.target.value)}>
              <option value="">— None —</option>
              {TIERS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Badge</span>
            <select className="admin-select" value={draft.badge} onChange={(e) => set("badge", e.target.value)}>
              <option value="">— None —</option>
              {BADGES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="admin-row">
          <label className="admin-field">
            <span>Price (number) *</span>
            <input className="admin-input" type="number" step="0.01" value={draft.price} onChange={(e) => set("price", e.target.value)} required placeholder="1675" />
          </label>
          <label className="admin-field">
            <span>Price display</span>
            <input className="admin-input" value={draft.priceDisplay} onChange={(e) => set("priceDisplay", e.target.value)} placeholder="A$1,675" />
          </label>
        </div>

        <h3 style={{ color: "var(--navy)" }}>Makkah hotel</h3>
        <label className="admin-field">
          <span>Hotel name</span>
          <input className="admin-input" value={draft.makkahHotel} onChange={(e) => set("makkahHotel", e.target.value)} />
        </label>
        <div className="admin-row">
          <label className="admin-field">
            <span>Nights</span>
            <input className="admin-input" value={draft.makkahNights} onChange={(e) => set("makkahNights", e.target.value)} placeholder="6 nights" />
          </label>
          <label className="admin-field">
            <span>Rating (0–5)</span>
            <input className="admin-input" type="number" step="0.1" min="0" max="5" value={draft.makkahRating} onChange={(e) => set("makkahRating", e.target.value)} />
          </label>
        </div>
        <label className="admin-field">
          <span>Distance</span>
          <input className="admin-input" value={draft.makkahDistance} onChange={(e) => set("makkahDistance", e.target.value)} placeholder="≈300 m from the Haram" />
        </label>

        <h3 style={{ color: "var(--navy)" }}>Madinah hotel</h3>
        <label className="admin-field">
          <span>Hotel name</span>
          <input className="admin-input" value={draft.madinahHotel} onChange={(e) => set("madinahHotel", e.target.value)} />
        </label>
        <div className="admin-row">
          <label className="admin-field">
            <span>Nights</span>
            <input className="admin-input" value={draft.madinahNights} onChange={(e) => set("madinahNights", e.target.value)} placeholder="4 nights" />
          </label>
          <label className="admin-field">
            <span>Rating (0–5)</span>
            <input className="admin-input" type="number" step="0.1" min="0" max="5" value={draft.madinahRating} onChange={(e) => set("madinahRating", e.target.value)} />
          </label>
        </div>
        <label className="admin-field">
          <span>Distance</span>
          <input className="admin-input" value={draft.madinahDistance} onChange={(e) => set("madinahDistance", e.target.value)} placeholder="≈250 m from Masjid an-Nabawi" />
        </label>

        <h3 style={{ color: "var(--navy)" }}>Flight</h3>
        <div className="admin-row">
          <label className="admin-field">
            <span>Airline</span>
            <input className="admin-input" value={draft.flightAirline} onChange={(e) => set("flightAirline", e.target.value)} placeholder="Qatar Airways" />
          </label>
          <label className="admin-field">
            <span>Routing</span>
            <input className="admin-input" value={draft.flightRouting} onChange={(e) => set("flightRouting", e.target.value)} placeholder="1 stop via Doha" />
          </label>
        </div>

        <label className="admin-field">
          <span>Departure dates (one per line)</span>
          <textarea className="admin-textarea" value={draft.departureDates} onChange={(e) => set("departureDates", e.target.value)} placeholder={"4 Sep 2026\n18 Sep 2026"} />
        </label>

        <div className="admin-field">
          <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>
            Room rates
          </span>
          {draft.roomRates.map((r, i) => (
            <div className="admin-row" key={i} style={{ marginBottom: 8 }}>
              <input className="admin-input" placeholder="Room (e.g. Quad)" value={r.room} onChange={(e) => updateRate(i, "room", e.target.value)} />
              <div style={{ display: "flex", gap: 8 }}>
                <input className="admin-input" placeholder="A$1,675" value={r.priceDisplay} onChange={(e) => updateRate(i, "priceDisplay", e.target.value)} />
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => removeRate(i)}>✕</button>
              </div>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addRate}>+ Add room rate</button>
        </div>

        <div className="admin-field">
          <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>
            Inclusions
          </span>
          <div className="admin-actions">
            {INCLUSIONS.map((key) => (
              <label key={key} style={{ textTransform: "capitalize" }}>
                <input
                  type="checkbox"
                  checked={draft.inclusions.includes(key)}
                  onChange={(e) => toggleInclusion(key, e.target.checked)}
                />{" "}
                {key}
              </label>
            ))}
          </div>
        </div>

        <div className="admin-actions" style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" checked={draft.mostPopular} onChange={(e) => set("mostPopular", e.target.checked)} />{" "}
            Most popular (highlighted card)
          </label>
          {!isEdit && (
            <label>
              <input type="checkbox" checked={draft.isPublished} onChange={(e) => set("isPublished", e.target.checked)} />{" "}
              Publish immediately
            </label>
          )}
        </div>

        {err && <div className="admin-error">{err}</div>}
        <div className="admin-actions">
          <button className="admin-btn" type="submit" disabled={busy}>
            {busy ? "Saving…" : isEdit ? "Save changes" : "Create package"}
          </button>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => navigate("/admin/packages")}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
