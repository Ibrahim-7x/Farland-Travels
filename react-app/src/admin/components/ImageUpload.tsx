import { useId, useRef, useState } from "react";
import { apiUpload } from "../api";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
};

/**
 * Image field for the admin forms. Upload a file (sent to /api/admin/uploads,
 * re-encoded to WebP server-side) OR paste an image URL directly. Either way
 * the resulting URL string is stored on the destination record.
 */
export function ImageUpload({ label, value, onChange, hint }: Props) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const { url } = await apiUpload<{ url: string }>("/admin/uploads", file);
      onChange(url);
    } catch (error) {
      setErr((error as Error).message || "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="admin-field">
      <span>{label}</span>
      <div className="admin-image-upload">
        <div className="admin-image-preview" aria-hidden={!value}>
          {value ? (
            <img src={value} alt="" />
          ) : (
            <span className="admin-muted">No image</span>
          )}
        </div>
        <div className="admin-image-controls">
          <input
            ref={fileRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="admin-actions">
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              {busy ? "Uploading…" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                disabled={busy}
                onClick={() => onChange("")}
              >
                Clear
              </button>
            )}
          </div>
          <input
            className="admin-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
          />
          {hint && <small className="admin-muted">{hint}</small>}
          {err && <div className="admin-error">{err}</div>}
        </div>
      </div>
    </div>
  );
}
