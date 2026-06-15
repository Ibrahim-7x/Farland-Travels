import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api";

const PLACEHOLDER_PHONE = "+61 0 0000 0000";

export function DashboardPage() {
  const [newEnquiries, setNewEnquiries] = useState<number | null>(null);
  const [publishedPackages, setPublishedPackages] = useState<number | null>(null);
  const [publishedReviews, setPublishedReviews] = useState<number | null>(null);
  const [placeholderWarning, setPlaceholderWarning] = useState(false);

  useEffect(() => {
    apiGet<{ total: number }>("/admin/enquiries?status=new&pageSize=1")
      .then((d) => setNewEnquiries(d.total))
      .catch(() => {});
    apiGet<{ isPublished: boolean }[]>("/admin/umrah-packages")
      .then((d) => setPublishedPackages(d.filter((p) => p.isPublished).length))
      .catch(() => {});
    apiGet<{ isPublished: boolean }[]>("/admin/reviews")
      .then((d) => setPublishedReviews(d.filter((r) => r.isPublished).length))
      .catch(() => {});
    apiGet<Record<string, string>>("/admin/settings")
      .then((s) => {
        const incomplete =
          !s.business_name ||
          !s.contact_phone ||
          s.contact_phone === PLACEHOLDER_PHONE ||
          !s.contact_email ||
          !s.address;
        setPlaceholderWarning(incomplete);
      })
      .catch(() => {});
  }, []);

  const show = (n: number | null) => (n === null ? "…" : n);

  return (
    <>
      <h1 className="admin-h1">Dashboard</h1>
      <p className="admin-sub">Overview of your site content and enquiries.</p>

      {placeholderWarning && (
        <div className="admin-banner">
          ⚠️ Some site settings are still placeholders or empty. Visitors may
          see incomplete contact details — update them in{" "}
          <Link to="/admin/settings">Settings</Link> before launch.
        </div>
      )}

      <div className="admin-stat-grid">
        <div className="admin-stat">
          <strong>{show(newEnquiries)}</strong>
          <span>New enquiries</span>
        </div>
        <div className="admin-stat">
          <strong>{show(publishedPackages)}</strong>
          <span>Published packages</span>
        </div>
        <div className="admin-stat">
          <strong>{show(publishedReviews)}</strong>
          <span>Published reviews</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-actions">
          <Link className="admin-btn" to="/admin/enquiries">View enquiries</Link>
          <Link className="admin-btn admin-btn-ghost" to="/admin/packages">Manage packages</Link>
          <Link className="admin-btn admin-btn-ghost" to="/admin/reviews">Manage reviews</Link>
          <Link className="admin-btn admin-btn-ghost" to="/admin/content">Edit content</Link>
        </div>
      </div>
    </>
  );
}
