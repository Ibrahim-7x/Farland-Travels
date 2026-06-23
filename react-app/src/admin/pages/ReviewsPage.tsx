import { useCallback, useEffect, useState } from "react";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../api";

type Review = {
  id: number;
  authorName: string;
  location: string | null;
  rating: number;
  body: string;
  source: string;
  isSample: boolean;
  isPublished: boolean;
  createdAt: string;
};

type Draft = {
  authorName: string;
  location: string;
  rating: number;
  body: string;
  source: "manual" | "google";
  isSample: boolean;
  isPublished: boolean;
};

const BLANK: Draft = {
  authorName: "",
  location: "",
  rating: 5,
  body: "",
  source: "manual",
  isSample: false,
  isPublished: false,
};

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Review | "new" | null>(null);

  const load = useCallback(() => {
    apiGet<Review[]>("/admin/reviews")
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const togglePublish = async (r: Review) => {
    await apiPatch(`/admin/reviews/${r.id}/publish`);
    load();
  };
  const remove = async (r: Review) => {
    if (!window.confirm("Delete this review permanently?")) return;
    await apiDelete(`/admin/reviews/${r.id}`);
    load();
  };

  return (
    <>
      <h1 className="admin-h1">Reviews</h1>
      <p className="admin-sub">
        Reviews are unpublished by default. Replace the sample rows with real
        customer reviews before publishing.
      </p>

      {editing ? (
        <ReviewForm
          review={editing === "new" ? null : editing}
          onDone={() => {
            setEditing(null);
            load();
          }}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div className="admin-actions" style={{ marginBottom: 16 }}>
          <button className="admin-btn" onClick={() => setEditing("new")}>
            + New review
          </button>
        </div>
      )}

      <div className="admin-card">
        {loading ? (
          <p className="admin-muted">Loading…</p>
        ) : reviews.length === 0 ? (
          <p className="admin-muted">No reviews yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.authorName}
                    {r.isSample && <span className="admin-badge sample">SAMPLE</span>}
                    {r.location && (
                      <div className="admin-muted">{r.location}</div>
                    )}
                  </td>
                  <td>{"★".repeat(r.rating)}</td>
                  <td>
                    <span className={`admin-badge ${r.isPublished ? "on" : "off"}`}>
                      {r.isPublished ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => setEditing(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => togglePublish(r)}
                      >
                        {r.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => remove(r)}
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

function ReviewForm({
  review,
  onDone,
  onCancel,
}: {
  review: Review | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(
    review
      ? {
          authorName: review.authorName,
          location: review.location ?? "",
          rating: review.rating,
          body: review.body,
          source: review.source === "google" ? "google" : "manual",
          isSample: review.isSample,
          isPublished: review.isPublished,
        }
      : BLANK,
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      if (review) await apiPut(`/admin/reviews/${review.id}`, draft);
      else await apiPost("/admin/reviews", draft);
      onDone();
    } catch (error) {
      setErr((error as Error).message || "Could not save review");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="admin-card" onSubmit={submit}>
      <h3 style={{ marginTop: 0, color: "var(--navy)" }}>
        {review ? "Edit review" : "New review"}
      </h3>
      <div className="admin-row">
        <label className="admin-field">
          <span>Author name</span>
          <input
            className="admin-input"
            value={draft.authorName}
            onChange={(e) => set("authorName", e.target.value)}
            required
          />
        </label>
        <label className="admin-field">
          <span>Location</span>
          <input
            className="admin-input"
            value={draft.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </label>
      </div>
      <div className="admin-row">
        <label className="admin-field">
          <span>Rating</span>
          <select
            className="admin-select"
            value={draft.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>Source</span>
          <select
            className="admin-select"
            value={draft.source}
            onChange={(e) => set("source", e.target.value as Draft["source"])}
          >
            <option value="manual">Manual</option>
            <option value="google">Google</option>
          </select>
        </label>
      </div>
      <label className="admin-field">
        <span>Review text</span>
        <textarea
          className="admin-textarea"
          value={draft.body}
          onChange={(e) => set("body", e.target.value)}
          required
        />
      </label>
      <div className="admin-actions" style={{ marginBottom: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={draft.isSample}
            onChange={(e) => set("isSample", e.target.checked)}
          />{" "}
          Sample
        </label>
        <label>
          <input
            type="checkbox"
            checked={draft.isPublished}
            onChange={(e) => set("isPublished", e.target.checked)}
          />{" "}
          Published
        </label>
      </div>
      {err && <div className="admin-error">{err}</div>}
      <div className="admin-actions">
        <button className="admin-btn" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save review"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-ghost"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
