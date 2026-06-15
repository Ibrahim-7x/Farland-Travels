import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api";

type Enquiry = {
  id: number;
  type: string;
  name: string;
  email: string;
  status: string;
  sourcePage: string | null;
  createdAt: string;
};
type ListResponse = {
  items: Enquiry[];
  total: number;
  page: number;
  pageSize: number;
};

const PAGE_SIZE = 20;

export function EnquiriesPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));
    let cancelled = false;
    apiGet<ListResponse>(`/admin/enquiries?${params.toString()}`)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, type, page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <>
      <h1 className="admin-h1">Enquiries</h1>
      <p className="admin-sub">Form submissions from the website.</p>

      <div className="admin-toolbar">
        <label className="admin-field" style={{ margin: 0 }}>
          <span>Status</span>
          <select
            className="admin-select"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label className="admin-field" style={{ margin: 0 }}>
          <span>Type</span>
          <select
            className="admin-select"
            value={type}
            onChange={(e) => {
              setPage(1);
              setType(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="holiday">Holiday</option>
            <option value="umrah">Umrah</option>
            <option value="quote">Quote</option>
          </select>
        </label>
      </div>

      <div className="admin-card">
        {loading ? (
          <p className="admin-muted">Loading…</p>
        ) : !data || data.items.length === 0 ? (
          <p className="admin-muted">No enquiries found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((e) => (
                <tr
                  key={e.id}
                  className="admin-row-click"
                  onClick={() => navigate(`/admin/enquiries/${e.id}`)}
                >
                  <td>{e.createdAt}</td>
                  <td>{e.name}</td>
                  <td>{e.type}</td>
                  <td>{e.status}</td>
                  <td>{e.sourcePage ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.total > PAGE_SIZE && (
        <div className="admin-actions">
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="admin-muted">
            Page {page} of {totalPages}
          </span>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
