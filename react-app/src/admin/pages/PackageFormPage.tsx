import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../api";
import { PackageInlineEditor } from "../components/PackageInlineEditor";

const BADGES = ["", "Best Seller", "Limited Seats", "Early Bird"];

type RoomRate = { room: string; priceDisplay: string };

export type Draft = {
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
  departureDates: string[];
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
  departureDates: [],
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
    departureDates: p.departureDates ?? [],
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
    departureDates: d.departureDates.map((s) => s.trim()).filter(Boolean),
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

  const submit = async () => {
    if (!draft.city.trim()) return setErr("Add a departure city before saving.");
    if (!draft.stars.trim()) return setErr("Add a star rating before saving.");
    if (!draft.nights.trim()) return setErr("Add the nights before saving.");
    if (!draft.roomType.trim()) return setErr("Add a room type before saving.");
    if (draft.price === "" || Number.isNaN(Number(draft.price)))
      return setErr("Add a numeric price (used for sorting) in the settings panel.");
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
      <div className="iedeal-bar">
        <button
          type="button"
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={() => navigate("/admin/packages")}
        >
          ← Cancel
        </button>
        <span className="iedeal-bar-title">
          {isEdit ? "Editing" : "New package"}
          {draft.name ? `: ${draft.name}` : draft.city ? `: ${draft.city}` : ""}
        </span>
        <label className="iedeal-pub">
          <input
            type="checkbox"
            checked={draft.isPublished}
            onChange={(e) => set("isPublished", e.target.checked)}
          />
          Published
        </label>
        <button className="admin-btn" type="button" onClick={submit} disabled={busy}>
          {busy ? "Saving…" : isEdit ? "Save changes" : "Create package"}
        </button>
      </div>

      {err && <div className="admin-error" style={{ marginBottom: 14 }}>{err}</div>}

      <p className="admin-sub" style={{ marginBottom: 16 }}>
        This is the package as it appears on the Umrah page — hover any line to
        edit it. The numeric price and a few flags are in the panel below.
      </p>

      <PackageInlineEditor draft={draft} set={set} />

      <details className="iedeal-settings" open={!isEdit}>
        <summary>⚙ Price &amp; listing settings</summary>
        <div className="iedeal-settings-body">
          <div className="admin-row">
            <label className="admin-field">
              <span>Price — numeric, AUD (used for sorting / "from" price) *</span>
              <input
                className="admin-input"
                type="number"
                step="0.01"
                value={draft.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="1675"
              />
            </label>
            <label className="admin-field">
              <span>Badge (ribbon on cards)</span>
              <select
                className="admin-select"
                value={draft.badge}
                onChange={(e) => set("badge", e.target.value)}
              >
                {BADGES.map((b) => (
                  <option key={b || "none"} value={b}>
                    {b || "— None —"}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="admin-actions">
            <label>
              <input
                type="checkbox"
                checked={draft.mostPopular}
                onChange={(e) => set("mostPopular", e.target.checked)}
              />{" "}
              Most popular (highlighted card — one per city)
            </label>
          </div>
        </div>
      </details>
    </>
  );
}
