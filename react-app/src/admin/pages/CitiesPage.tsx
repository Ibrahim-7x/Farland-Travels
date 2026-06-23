import { useCallback, useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost } from "../api";

type City = {
  id: string;
  name: string;
  sortOrder: number;
};

export function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(() => {
    apiGet<City[]>("/admin/cities")
      .then(setCities)
      .catch(() => setCities([]))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    setErr("");
    try {
      await apiPost("/admin/cities", { name: trimmed });
      setName("");
      load();
    } catch (error) {
      setErr((error as Error).message || "Could not add city.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: City) => {
    if (
      !window.confirm(
        `Remove "${c.name}" from the city list? Packages already using this city are not deleted.`,
      )
    )
      return;
    await apiDelete(`/admin/cities/${c.id}`);
    load();
  };

  return (
    <>
      <h1 className="admin-h1">Cities</h1>
      <p className="admin-sub">
        Departure cities shown in the Umrah page filter and the package form
        dropdown. Removing a city here does not delete its packages.
      </p>

      <form className="admin-card" onSubmit={add} style={{ marginBottom: 16 }}>
        <div className="admin-row">
          <label className="admin-field">
            <span>City name</span>
            <input
              className="admin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Perth"
            />
          </label>
          <div
            className="admin-field"
            style={{ justifyContent: "flex-end", display: "flex" }}
          >
            <button className="admin-btn" type="submit" disabled={busy}>
              {busy ? "Adding…" : "+ Add city"}
            </button>
          </div>
        </div>
        {err && <div className="admin-error">{err}</div>}
      </form>

      <div className="admin-card">
        {loading ? (
          <p className="admin-muted">Loading…</p>
        ) : cities.length === 0 ? (
          <p className="admin-muted">No cities yet — add one above.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    <span className="admin-muted">{c.id}</span>
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => remove(c)}
                    >
                      Remove
                    </button>
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
