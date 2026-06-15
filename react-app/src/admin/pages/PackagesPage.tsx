import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiDelete, apiGet, apiPatch, apiPost } from "../api";

type Pkg = {
  id: string;
  city: string;
  name: string | null;
  tier: string | null;
  priceDisplay: string | null;
  price: number;
  isPublished: boolean;
  sortOrder: number;
  mostPopular: boolean;
};

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

  return (
    <>
      <h1 className="admin-h1">Umrah Packages</h1>
      <p className="admin-sub">
        Only published packages appear on the public Umrah page.
      </p>

      <div className="admin-actions" style={{ marginBottom: 16 }}>
        <Link className="admin-btn" to="/admin/packages/new">
          + New package
        </Link>
      </div>

      <div className="admin-card">
        {loading ? (
          <p className="admin-muted">Loading…</p>
        ) : packages.length === 0 ? (
          <p className="admin-muted">No packages yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>City</th>
                <th>Tier</th>
                <th>From</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.name ?? p.id}
                    {p.mostPopular && (
                      <span className="admin-badge sample">POPULAR</span>
                    )}
                  </td>
                  <td>{p.city}</td>
                  <td>{p.tier ?? "—"}</td>
                  <td>{p.priceDisplay ?? `A$${p.price}`}</td>
                  <td>
                    <span className={`admin-badge ${p.isPublished ? "on" : "off"}`}>
                      {p.isPublished ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        disabled={busy}
                        onClick={() => move(p, "up")}
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        disabled={busy}
                        onClick={() => move(p, "down")}
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
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
                      >
                        Duplicate
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => remove(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
