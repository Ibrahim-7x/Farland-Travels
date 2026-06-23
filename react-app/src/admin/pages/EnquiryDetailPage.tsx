import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, apiPatch } from "../api";
import {
  STATUS_LABELS,
  TYPE_LABELS,
  formatDateTime,
  formatRelative,
  statusClass,
  typeClass,
} from "../format";

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

const STATUSES = ["new", "contacted", "closed"] as const;

function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function renderValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
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
    if (!enquiry || status === enquiry.status) return;
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
  const replySubject = encodeURIComponent(
    `Re: your ${TYPE_LABELS[enquiry.type] ?? enquiry.type} enquiry with Farland`,
  );

  return (
    <>
      <Link to="/admin/enquiries" className="admin-muted">
        ← Back to enquiries
      </Link>

      <div className="admin-detail-head">
        <div>
          <h1 className="admin-h1" style={{ marginTop: 8 }}>
            {enquiry.name}
          </h1>
          <div className="admin-detail-meta">
            <span className={typeClass(enquiry.type)}>
              {TYPE_LABELS[enquiry.type] ?? enquiry.type}
            </span>
            <span className={statusClass(enquiry.status)}>
              {STATUS_LABELS[enquiry.status] ?? enquiry.status}
            </span>
            <span className="admin-muted">Enquiry #{enquiry.id}</span>
            <span className="admin-muted">
              · {formatDateTime(enquiry.createdAt)} ({formatRelative(enquiry.createdAt)})
            </span>
          </div>
        </div>
        <div className="admin-actions">
          <a className="admin-btn" href={`mailto:${enquiry.email}?subject=${replySubject}`}>
            ✉ Reply by email
          </a>
          {enquiry.phone && (
            <a
              className="admin-btn admin-btn-ghost"
              href={`tel:${enquiry.phone.replace(/[^+\d]/g, "")}`}
            >
              ☎ Call
            </a>
          )}
        </div>
      </div>

      <div className="admin-card">
        <span className="admin-field-title">Update status</span>
        <div className="admin-segment" role="group" aria-label="Update status">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={`admin-segment-btn ${enquiry.status === s ? "active" : ""}`}
              disabled={saving}
              onClick={() => updateStatus(s)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
          {saving && <span className="admin-muted" style={{ marginLeft: 10 }}>Saving…</span>}
        </div>
      </div>

      <div className="admin-card">
        <h3>Contact</h3>
        <div className="admin-kv-grid">
          <div className="admin-kv">
            <span className="admin-kv-label">Email</span>
            <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
          </div>
          <div className="admin-kv">
            <span className="admin-kv-label">Phone</span>
            {enquiry.phone ? (
              <a href={`tel:${enquiry.phone.replace(/[^+\d]/g, "")}`}>
                {enquiry.phone}
              </a>
            ) : (
              <span className="admin-muted">—</span>
            )}
          </div>
          <div className="admin-kv">
            <span className="admin-kv-label">Source page</span>
            <span>{enquiry.sourcePage || "—"}</span>
          </div>
          <div className="admin-kv">
            <span className="admin-kv-label">Received</span>
            <span>{formatDateTime(enquiry.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Enquiry details</h3>
        {payloadEntries.length === 0 ? (
          <p className="admin-muted">No additional details were submitted.</p>
        ) : (
          <table className="admin-table admin-table-kv">
            <tbody>
              {payloadEntries.map(([key, value]) => (
                <tr key={key}>
                  <th style={{ width: 220 }}>{humanize(key)}</th>
                  <td>
                    <span style={{ whiteSpace: "pre-wrap" }}>
                      {renderValue(value)}
                    </span>
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
