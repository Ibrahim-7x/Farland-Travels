import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api";

type Settings = {
  business_name: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_email: string;
  abn: string;
  address: string;
};

const EMPTY: Settings = {
  business_name: "",
  contact_phone: "",
  contact_whatsapp: "",
  contact_email: "",
  abn: "",
  address: "",
};

const PLACEHOLDER_PHONE = "+61 0 0000 0000";

const FIELDS: { key: keyof Settings; label: string }[] = [
  { key: "business_name", label: "Business name" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "contact_whatsapp", label: "WhatsApp number" },
  { key: "contact_email", label: "Contact email" },
  { key: "abn", label: "ABN" },
  { key: "address", label: "Address" },
];

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet<Settings>("/admin/settings")
      .then((s) => setSettings({ ...EMPTY, ...s }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const incomplete =
    !settings.business_name ||
    !settings.contact_phone ||
    settings.contact_phone === PLACEHOLDER_PHONE ||
    !settings.contact_email ||
    !settings.address;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const updated = await apiPut<Settings>("/admin/settings", settings);
      setSettings({ ...EMPTY, ...updated });
      setSaved(true);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-muted">Loading…</p>;

  return (
    <>
      <h1 className="admin-h1">Settings</h1>
      <p className="admin-sub">Contact details shown across the public site.</p>

      {incomplete && (
        <div className="admin-banner">
          ⚠️ One or more contact details are still placeholders or empty. Fill
          them in before launch — they appear in the site footer and contact page.
        </div>
      )}

      <form className="admin-card" onSubmit={save}>
        {FIELDS.map(({ key, label }) => (
          <label className="admin-field" key={key}>
            <span>{label}</span>
            <input
              className="admin-input"
              value={settings[key]}
              onChange={(e) =>
                setSettings((s) => ({ ...s, [key]: e.target.value }))
              }
            />
          </label>
        ))}
        <div className="admin-actions">
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </button>
          {saved && <span className="admin-success">Saved.</span>}
        </div>
      </form>

      <PasswordChange />
    </>
  );
}

function PasswordChange() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setBusy(true);
    try {
      await apiPost("/auth/change-password", { currentPassword, newPassword });
      setMsg("Password updated.");
      setCurrent("");
      setNew("");
    } catch (error) {
      setErr((error as Error).message || "Could not change password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="admin-card" onSubmit={submit}>
      <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Change password</h3>
      <label className="admin-field">
        <span>Current password</span>
        <input
          className="admin-input"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          required
          autoComplete="current-password"
        />
      </label>
      <label className="admin-field">
        <span>New password (min 8 characters)</span>
        <input
          className="admin-input"
          type="password"
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      {err && <div className="admin-error">{err}</div>}
      {msg && <div className="admin-success">{msg}</div>}
      <button className="admin-btn" type="submit" disabled={busy}>
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
