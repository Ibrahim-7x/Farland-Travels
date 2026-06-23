import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiDelete, apiGet, apiPatch, apiPost } from "../api";

type Deal = {
  id: string;
  slug: string;
  name: string;
  region: string;
  regionLabel: string;
  fromPrice: string;
  badge?: string;
  rating: string;
  ratingText: string;
  image: string;
  tags: string[];
  metaItems: { strong: string; rest: string }[];
  pricing: { month: string; display: string }[];
  packages: unknown[];
  isPublished: boolean;
  sortOrder: number;
};

export function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    apiGet<Deal[]>("/admin/destinations")
      .then(setDeals)
      .catch(() => setDeals([]))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const togglePublish = async (d: Deal) => {
    await apiPatch(`/admin/destinations/${d.id}/publish`);
    load();
  };
  const duplicate = async (d: Deal) => {
    await apiPost(`/admin/destinations/${d.id}/duplicate`);
    load();
  };
  const remove = async (d: Deal) => {
    if (!window.confirm(`Delete "${d.name}" permanently?`)) return;
    await apiDelete(`/admin/destinations/${d.id}`);
    load();
  };

  // Reorder by swapping sort_order with the neighbour (global order).
  const move = async (d: Deal, dir: "up" | "down") => {
    const ordered = [...deals].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = ordered.findIndex((x) => x.id === d.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= ordered.length) return;
    const a = ordered[idx];
    const b = ordered[swapIdx];
    if (!a || !b) return;
    setBusy(true);
    try {
      await apiPost("/admin/destinations/reorder", [
        { id: a.id, sort_order: b.sortOrder },
        { id: b.id, sort_order: a.sortOrder },
      ]);
      load();
    } finally {
      setBusy(false);
    }
  };

  const ordered = [...deals].sort((a, b) => a.sortOrder - b.sortOrder);
  const publishedCount = deals.filter((d) => d.isPublished).length;

  return (
    <>
      <h1 className="admin-h1">Deals &amp; Destinations</h1>
      <p className="admin-sub">
        Holiday deals shown on the Home, Deals, Destinations and search pages —
        previewed here just as they appear on the public site. Only published
        deals go live; the order below is the order visitors see.
      </p>

      <div className="admin-grid-toolbar">
        <span className="admin-grid-count">
          <strong>{deals.length}</strong> deal{deals.length === 1 ? "" : "s"} ·{" "}
          <strong>{publishedCount}</strong> published
        </span>
        <Link className="admin-btn" to="/admin/deals/new">
          + New deal
        </Link>
      </div>

      {loading ? (
        <div className="admin-card">
          <p className="admin-muted">Loading…</p>
        </div>
      ) : deals.length === 0 ? (
        <div className="admin-card">
          <p className="admin-muted">No deals yet — create one.</p>
        </div>
      ) : (
        <div className="admin-prod-grid">
          {ordered.map((d, i) => (
            <article
              className={`admin-prod-card ${d.isPublished ? "" : "is-hidden"}`}
              key={d.id}
            >
              <div className="admin-prod-media">
                {d.image ? (
                  <img src={d.image} alt={d.name} loading="lazy" />
                ) : (
                  <div className="admin-prod-media-fallback">
                    <span>🌴</span>
                  </div>
                )}
                <div className="admin-prod-overlay-tl">
                  <span
                    className={`admin-prod-pill ${d.isPublished ? "live" : "hidden"}`}
                  >
                    {d.isPublished ? "● Published" : "Hidden"}
                  </span>
                </div>
                {d.badge && (
                  <div className="admin-prod-overlay-tr">
                    <span className="admin-prod-pill badge">{d.badge}</span>
                  </div>
                )}
              </div>

              <div className="admin-prod-body">
                <div className="admin-prod-region">
                  {d.regionLabel || d.region || "—"}
                </div>
                <h3 className="admin-prod-title">{d.name}</h3>
                {(d.rating || d.ratingText) && (
                  <div className="admin-prod-rating">
                    {d.rating}
                    {d.ratingText && <span>{d.ratingText}</span>}
                  </div>
                )}

                {d.metaItems.length > 0 && (
                  <div className="admin-prod-chips">
                    {d.metaItems.slice(0, 3).map((m, idx) => (
                      <span className="admin-prod-chip muted" key={idx}>
                        {m.strong} {m.rest}
                      </span>
                    ))}
                  </div>
                )}

                {d.tags.length > 0 && (
                  <div className="admin-prod-chips">
                    {d.tags.slice(0, 3).map((t) => (
                      <span className="admin-prod-chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="admin-prod-price-row">
                  <div className="admin-prod-price">
                    <small>From per person</small>
                    <strong>{d.fromPrice || "—"}</strong>
                  </div>
                  <div className="admin-prod-price-meta">
                    {d.pricing.length > 0
                      ? `${d.pricing.length} month${d.pricing.length === 1 ? "" : "s"}`
                      : d.packages.length > 0
                        ? `${d.packages.length} option${d.packages.length === 1 ? "" : "s"}`
                        : ""}
                  </div>
                </div>
              </div>

              <div className="admin-prod-foot">
                <button
                  className="admin-prod-iconbtn"
                  disabled={busy || i === 0}
                  onClick={() => move(d, "up")}
                  aria-label="Move up"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className="admin-prod-iconbtn"
                  disabled={busy || i === ordered.length - 1}
                  onClick={() => move(d, "down")}
                  aria-label="Move down"
                  title="Move down"
                >
                  ↓
                </button>
                <span className="spacer" />
                <Link
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  to={`/admin/deals/${d.id}`}
                >
                  Edit
                </Link>
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => togglePublish(d)}
                >
                  {d.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => duplicate(d)}
                  title="Duplicate"
                >
                  Duplicate
                </button>
                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => remove(d)}
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
