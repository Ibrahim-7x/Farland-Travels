import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../api";
import { ImageUpload } from "../components/ImageUpload";
import { DealInlineEditor } from "../components/DealInlineEditor";

type MetaItem = { strong: string; rest: string };
type Highlight = { icon: string; title: string; text: string };
type Component = { label: string; details: string };
type Pricing = { month: string; amount: string; currency: string; display: string };
type SubPackage = {
  id: string;
  name: string;
  stars: string;
  duration: string;
  hotels: string;
  roomType: string;
  priceDisplay: string;
};

export type Draft = {
  slug: string;
  name: string;
  subtitle: string;
  region: string;
  regionLabel: string;
  image: string;
  heroImage: string;
  description: string;
  tagline: string;
  fromPrice: string;
  badge: string;
  rating: string;
  ratingText: string;
  transfersIncluded: string;
  packagesNote: string;
  tagsText: string;
  stylesText: string;
  metaItems: MetaItem[];
  highlights: Highlight[];
  components: Component[];
  pricing: Pricing[];
  packages: SubPackage[];
  isPublished: boolean;
};

const BLANK: Draft = {
  slug: "",
  name: "",
  subtitle: "",
  region: "",
  regionLabel: "",
  image: "",
  heroImage: "",
  description: "",
  tagline: "",
  fromPrice: "",
  badge: "",
  rating: "★★★★★",
  ratingText: "",
  transfersIncluded: "",
  packagesNote: "",
  tagsText: "",
  stylesText: "",
  metaItems: [],
  highlights: [],
  components: [],
  pricing: [],
  packages: [],
  isPublished: false,
};

type ApiDeal = {
  slug: string;
  name: string;
  subtitle: string;
  region: string;
  regionLabel: string;
  image: string;
  heroImage: string;
  description: string;
  tagline: string;
  fromPrice: string;
  badge?: string | null;
  rating: string;
  ratingText: string;
  transfersIncluded: string;
  packagesNote?: string | null;
  tags: string[];
  styles: string[];
  metaItems: MetaItem[];
  highlights: Highlight[];
  components: Component[];
  pricing: Pricing[];
  packages: SubPackage[];
  isPublished: boolean;
};

function fromApi(d: ApiDeal): Draft {
  return {
    slug: d.slug ?? "",
    name: d.name ?? "",
    subtitle: d.subtitle ?? "",
    region: d.region ?? "",
    regionLabel: d.regionLabel ?? "",
    image: d.image ?? "",
    heroImage: d.heroImage ?? "",
    description: d.description ?? "",
    tagline: d.tagline ?? "",
    fromPrice: d.fromPrice ?? "",
    badge: d.badge ?? "",
    rating: d.rating ?? "",
    ratingText: d.ratingText ?? "",
    transfersIncluded: d.transfersIncluded ?? "",
    packagesNote: d.packagesNote ?? "",
    tagsText: (d.tags ?? []).join(", "),
    stylesText: (d.styles ?? []).join(", "),
    metaItems: d.metaItems ?? [],
    highlights: d.highlights ?? [],
    components: d.components ?? [],
    pricing: d.pricing ?? [],
    packages: d.packages ?? [],
    isPublished: Boolean(d.isPublished),
  };
}

const splitList = (text: string): string[] =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

function toBody(d: Draft): Record<string, unknown> {
  return {
    slug: d.slug.trim() || undefined,
    name: d.name.trim(),
    subtitle: d.subtitle.trim(),
    region: d.region.trim(),
    regionLabel: d.regionLabel.trim(),
    // Card image falls back to the hero photo so listing cards never render
    // a broken image; hero falls back to the card image likewise.
    image: d.image.trim() || d.heroImage.trim(),
    heroImage: d.heroImage.trim() || d.image.trim(),
    description: d.description.trim(),
    tagline: d.tagline.trim(),
    fromPrice: d.fromPrice.trim(),
    badge: d.badge.trim() || null,
    rating: d.rating.trim(),
    ratingText: d.ratingText.trim(),
    transfersIncluded: d.transfersIncluded.trim(),
    packagesNote: d.packagesNote.trim() || null,
    tags: splitList(d.tagsText),
    styles: splitList(d.stylesText),
    metaItems: d.metaItems
      .filter((m) => m.strong.trim())
      .map((m) => ({ strong: m.strong.trim(), rest: m.rest.trim() })),
    highlights: d.highlights
      .filter((h) => h.title.trim())
      .map((h) => ({
        icon: h.icon.trim(),
        title: h.title.trim(),
        text: h.text.trim(),
      })),
    components: d.components
      .filter((c) => c.label.trim())
      .map((c) => ({ label: c.label.trim(), details: c.details.trim() })),
    pricing: d.pricing
      .filter((p) => p.month.trim() && p.display.trim())
      .map((p) => ({
        month: p.month.trim(),
        amount: p.amount.trim(),
        currency: p.currency.trim(),
        display: p.display.trim(),
      })),
    packages: d.packages
      .filter((p) => p.name.trim())
      .map((p, i) => ({
        id: p.id.trim() || `p${i + 1}`,
        name: p.name.trim(),
        stars: p.stars.trim(),
        duration: p.duration.trim(),
        hotels: p.hotels.trim(),
        roomType: p.roomType.trim(),
        priceDisplay: p.priceDisplay.trim(),
      })),
    isPublished: d.isPublished,
  };
}

export function DealFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>(BLANK);
  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    apiGet<ApiDeal>(`/admin/destinations/${id}`)
      .then((d) => setDraft(fromApi(d)))
      .catch(() => setErr("Could not load deal."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submit = async () => {
    if (!draft.name.trim()) {
      setErr("Add a deal name before saving.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const body = toBody(draft);
      if (isEdit) await apiPut(`/admin/destinations/${id}`, body);
      else await apiPost("/admin/destinations", body);
      navigate("/admin/deals");
    } catch (error) {
      setErr((error as Error).message || "Could not save deal.");
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
          onClick={() => navigate("/admin/deals")}
        >
          ← Cancel
        </button>
        <span className="iedeal-bar-title">
          {isEdit ? "Editing" : "New deal"}
          {draft.name ? `: ${draft.name}` : ""}
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
          {busy ? "Saving…" : isEdit ? "Save changes" : "Create deal"}
        </button>
      </div>

      {err && <div className="admin-error" style={{ marginBottom: 14 }}>{err}</div>}

      <p className="admin-sub" style={{ marginBottom: 16 }}>
        This is the deal page as visitors see it — hover any line to edit it
        directly. Listing-only settings (card image, tags, badge) are in the
        panel at the bottom.
      </p>

      <DealInlineEditor draft={draft} set={set} />

      {/* Behind-the-scenes listing & search fields that don't show on the page */}
      <details className="iedeal-settings" open={!isEdit}>
        <summary>⚙ Listing card &amp; search settings</summary>
        <div className="iedeal-settings-body">
          <ImageUpload
            label="Card image (shown on Home / Deals / Destinations listings)"
            value={draft.image}
            onChange={(url) => set("image", url)}
            hint="If left empty, the hero photo above is used on listing cards too."
          />

          <div className="admin-row">
            <label className="admin-field">
              <span>Badge (ribbon on cards)</span>
              <input
                className="admin-input"
                value={draft.badge}
                onChange={(e) => set("badge", e.target.value)}
                placeholder="✦ Editor's pick"
              />
            </label>
            <label className="admin-field">
              <span>Slug (URL)</span>
              <input
                className="admin-input"
                value={draft.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="singapore-bali (auto from name if blank)"
              />
            </label>
          </div>

          <div className="admin-row">
            <label className="admin-field">
              <span>Rating (stars)</span>
              <input
                className="admin-input"
                value={draft.rating}
                onChange={(e) => set("rating", e.target.value)}
                placeholder="★★★★★"
              />
            </label>
            <label className="admin-field">
              <span>Rating text</span>
              <input
                className="admin-input"
                value={draft.ratingText}
                onChange={(e) => set("ratingText", e.target.value)}
                placeholder="4.9 · Departing Perth"
              />
            </label>
          </div>

          <div className="admin-row">
            <label className="admin-field">
              <span>Tags (comma-separated)</span>
              <input
                className="admin-input"
                value={draft.tagsText}
                onChange={(e) => set("tagsText", e.target.value)}
                placeholder="City + Beach, Snorkelling, 11 Nights"
              />
            </label>
            <label className="admin-field">
              <span>Styles — drive the Deals category filter</span>
              <input
                className="admin-input"
                value={draft.stylesText}
                onChange={(e) => set("stylesText", e.target.value)}
                placeholder="Beach, Culture, Adventure"
              />
            </label>
          </div>
        </div>
      </details>
    </>
  );
}
