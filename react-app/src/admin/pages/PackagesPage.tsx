import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiDelete, apiGet, apiPatch, apiPost } from "../api";

type Pkg = {
  id: string;
  city: string;
  name: string | null;
  tier: string | null;
  stars: string;
  nights: string;
  roomType: string;
  makkahHotel: string | null;
  makkahNights: string | null;
  madinahHotel: string | null;
  madinahNights: string | null;
  priceDisplay: string | null;
  price: number;
  inclusions: string[];
  badge: string | null;
  isPublished: boolean;
  sortOrder: number;
  mostPopular: boolean;
};

const INCLUSION_META: Record<string, { icon: string; label: string }> = {
  visa: { icon: "🛂", label: "Umrah visa" },
  flights: { icon: "✈️", label: "Flights" },
  transfers: { icon: "🚌", label: "Transfers" },
  breakfast: { icon: "🍳", label: "Breakfast" },
  ziyarah: { icon: "🕌", label: "Ziyarah" },
  guide: { icon: "👥", label: "Guide" },
};

function nightsSplit(p: Pkg): string {
  const mk = parseInt(p.makkahNights ?? "", 10);
  const md = parseInt(p.madinahNights ?? "", 10);
  if (!mk || !md) return p.nights;
  return `${p.nights} · ${mk} Makkah + ${md} Madinah`;
}

export function PackagesPage() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    apiGet<Pkg[]>("/admin/umrah-packages")
      .then(setPackages)
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const togglePublish = async (p: Pkg) => {
    await apiPatch(`/admin/umrah-packages/${p.id}/publish`);
    load();
  };
  const duplicate = async (p: Pkg) => {
    await apiPost(`/admin/umrah-packages/${p.id}/duplicate`);
    load();
  };
  const remove = async (p: Pkg) => {
    if (!window.confirm(`Delete "${p.name ?? p.id}" permanently?`)) return;
    await apiDelete(`/admin/umrah-packages/${p.id}`);
    load();
  };

  // Reorder within the same city by swapping sort_order with the neighbour.
  const move = async (p: Pkg, dir: "up" | "down") => {
    const sameCity = packages
      .filter((x) => x.city === p.city)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sameCity.findIndex((x) => x.id === p.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sameCity.length) return;
    const a = sameCity[idx];
    const b = sameCity[swapIdx];
    if (!a || !b) return;
    setBusy(true);
    try {
      await apiPost("/admin/umrah-packages/reorder", [
        { id: a.id, sort_order: b.sortOrder },
        { id: b.id, sort_order: a.sortOrder },
      ]);
      load();
    } finally {
      setBusy(false);
    }
  };

  // Group by city (preserving the city order the API returns), sort within.
  const groups = useMemo(() => {
    const map = new Map<string, Pkg[]>();
    for (const p of packages) {
      if (!map.has(p.city)) map.set(p.city, []);
      map.get(p.city)!.push(p);
    }
    return Array.from(map.entries()).map(([city, list]) => ({
      city,
      list: [...list].sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, [packages]);

  const publishedCount = packages.filter((p) => p.isPublished).length;

  return (
    <>
      <h1 className="admin-h1">Umrah Packages</h1>
      <p className="admin-sub">
        Every package in the system, grouped by departure city — exactly as
        they're shown on the public Umrah page. Only published packages are
        visible to visitors.
      </p>

      <div className="admin-grid-toolbar">
        <span className="admin-grid-count">
          <strong>{packages.length}</strong> package
          {packages.length === 1 ? "" : "s"} · <strong>{publishedCount}</strong>{" "}
          published
        </span>
        <Link className="admin-btn" to="/admin/packages/new">
          + New package
        </Link>
      </div>

      {loading ? (
        <div className="admin-card">
          <p className="admin-muted">Loading…</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="admin-card">
          <p className="admin-muted">No packages yet — create one.</p>
        </div>
      ) : (
        groups.map(({ city, list }) => (
          <section className="admin-city-group" key={city}>
            <div className="admin-city-group-head">
              <h2>{city}</h2>
              <span className="line" />
              <span className="count">
                {list.length} package{list.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="admin-prod-grid">
              {list.map((p, i) => (
                <article
                  className={`admin-prod-card ${p.isPublished ? "" : "is-hidden"}`}
                  key={p.id}
                >
                  <div className="admin-prod-media">
                    <div className="admin-prod-media-fallback">
                      <span>🕋 {p.stars}</span>
                    </div>
                    <div className="admin-prod-overlay-tl">
                      <span
                        className={`admin-prod-pill ${p.isPublished ? "live" : "hidden"}`}
                      >
                        {p.isPublished ? "● Published" : "Hidden"}
                      </span>
                    </div>
                    <div className="admin-prod-overlay-tr">
                      {p.tier && (
                        <span className="admin-prod-pill tier">{p.tier}</span>
                      )}
                    </div>
                    {(p.badge || p.mostPopular) && (
                      <div className="admin-prod-overlay-bl">
                        <span
                          className={`admin-prod-pill ${p.mostPopular ? "popular" : "badge"}`}
                        >
                          {p.mostPopular ? "★ Most popular" : p.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="admin-prod-body">
                    <div className="admin-prod-region">{p.city}</div>
                    <h3 className="admin-prod-title">
                      {p.name ?? `${p.stars} package`}
                    </h3>

                    <div className="admin-prod-facts">
                      <div className="admin-prod-fact">
                        <span className="ico">🌙</span>
                        <span>
                          <strong>{nightsSplit(p)}</strong> · {p.roomType}
                        </span>
                      </div>
                      {p.makkahHotel && (
                        <div className="admin-prod-fact">
                          <span className="ico">🕋</span>
                          <span>{p.makkahHotel}</span>
                        </div>
                      )}
                      {p.madinahHotel && (
                        <div className="admin-prod-fact">
                          <span className="ico">🕌</span>
                          <span>{p.madinahHotel}</span>
                        </div>
                      )}
                    </div>

                    {p.inclusions.length > 0 && (
                      <div className="admin-prod-chips">
                        {p.inclusions.map((inc) => (
                          <span className="admin-prod-chip" key={inc}>
                            {INCLUSION_META[inc]?.icon ?? "✓"}{" "}
                            {INCLUSION_META[inc]?.label ?? inc}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="admin-prod-price-row">
                      <div className="admin-prod-price">
                        <small>From per person</small>
                        <strong>{p.priceDisplay ?? `A$${p.price}`}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="admin-prod-foot">
                    <button
                      className="admin-prod-iconbtn"
                      disabled={busy || i === 0}
                      onClick={() => move(p, "up")}
                      aria-label="Move up"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="admin-prod-iconbtn"
                      disabled={busy || i === list.length - 1}
                      onClick={() => move(p, "down")}
                      aria-label="Move down"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <span className="spacer" />
                    <Link
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      to={`/admin/packages/${p.id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => togglePublish(p)}
                    >
                      {p.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => duplicate(p)}
                      title="Duplicate"
                    >
                      Duplicate
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => remove(p)}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
