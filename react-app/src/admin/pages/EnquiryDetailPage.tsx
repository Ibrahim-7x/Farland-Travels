import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, apiPatch } from "../api";

type Enquiry = {
  id: number;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  payload: Record<string, unknown> | null;
  sourcePage: string | null;
  status: string;
  createdAt: string;
};

function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function renderValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function EnquiryDetailPage() {
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiGet<Enquiry>(`/admin/enquiries/${id}`)
      .then((d) => {
        if (!cancelled) setEnquiry(d);
      })
      .catch(() => {
        if (!cancelled) setEnquiry(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateStatus = async (status: string) => {
    if (!enquiry) return;
    setSaving(true);
    try {
      await apiPatch(`/admin/enquiries/${enquiry.id}/status`, { status });
      setEnquiry({ ...enquiry, status });
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-muted">Loading…</p>;
  if (!enquiry)
    return (
      <>
        <p className="admin-error">Enquiry not found.</p>
        <Link to="/admin/enquiries">← Back to enquiries</Link>
      </>
    );

  const payloadEntries = enquiry.payload ? Object.entries(enquiry.payload) : [];

  return (
    <>
      <Link to="/admin/enquiries" className="admin-muted">
        ← Back to enquiries
      </Link>
      <h1 className="admin-h1" style={{ marginTop: 8 }}>
        {enquiry.name}
      </h1>
      <p className="admin-sub">
        {enquiry.type} enquiry · {enquiry.createdAt}
      </p>

      <div className="admin-card">
        <div className="admin-row">
          <div className="admin-field">
            <label>Email</label>
            <div>
              <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
            </div>
          </div>
          <div className="admin-field">
            <label>Phone</label>
            <div>{enquiry.phone || "—"}</div>
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Source page</label>
            <div>{enquiry.sourcePage || "—"}</div>
          </div>
          <label className="admin-field">
            <span>Status</span>
            <select
              className="admin-select"
              value={enquiry.status}
              disabled={saving}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Enquiry details</h3>
        {payloadEntries.length === 0 ? (
          <p className="admin-muted">No additional details were submitted.</p>
        ) : (
          <table className="admin-table">
            <tbody>
              {payloadEntries.map(([key, value]) => (
                <tr key={key}>
                  <th style={{ width: 220 }}>{humanize(key)}</th>
                  <td>{renderValue(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
