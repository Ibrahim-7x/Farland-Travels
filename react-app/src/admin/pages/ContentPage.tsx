import { useEffect, useState } from "react";
import { marked } from "marked";
import { apiGet, apiPut } from "../api";

type ContentDoc = { key: string; title: string; body: string; updatedAt: string };

const KEYS: { key: string; label: string }[] = [
  { key: "privacy_policy", label: "Privacy Policy" },
  { key: "terms", label: "Terms & Conditions" },
];

export function ContentPage() {
  const [activeKey, setActiveKey] = useState("privacy_policy");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiGet<ContentDoc>(`/admin/content/${activeKey}`)
      .then((d) => {
        if (cancelled) return;
        setTitle(d.title);
        setBody(d.body);
      })
      .catch(() => {
        if (cancelled) return;
        setTitle("");
        setBody("");
      })
      .finally(() => {
        if (cancelled) return;
        setSaved(false);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeKey]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await apiPut(`/admin/content/${activeKey}`, { title, body });
      setSaved(true);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1 className="admin-h1">Content</h1>
      <p className="admin-sub">Edit the public Privacy Policy and Terms pages (markdown).</p>

      <div className="admin-actions" style={{ marginBottom: 16 }}>
        {KEYS.map((k) => (
          <button
            key={k.key}
            className={`admin-btn admin-btn-sm ${
              activeKey === k.key ? "" : "admin-btn-ghost"
            }`}
            onClick={() => setActiveKey(k.key)}
          >
            {k.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <form className="admin-card" onSubmit={save}>
          <label className="admin-field">
            <span>Title</span>
            <input
              className="admin-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <div className="admin-row">
            <label className="admin-field">
              <span>Body (markdown)</span>
              <textarea
                className="admin-textarea"
                style={{ minHeight: 360, fontFamily: "monospace" }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </label>
            <div className="admin-field">
              <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>
                Preview
              </span>
              <div
                className="admin-preview"
                style={{ minHeight: 360 }}
                dangerouslySetInnerHTML={{ __html: marked.parse(body) as string }}
              />
            </div>
          </div>
          <div className="admin-actions">
            <button className="admin-btn" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            {saved && <span className="admin-success">Saved.</span>}
          </div>
        </form>
      )}
    </>
  );
}
