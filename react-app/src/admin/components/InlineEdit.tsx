import { useEffect, useRef, useState } from "react";
import { apiUpload } from "../api";

type EditableProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  ariaLabel?: string;
};

/**
 * A text field that looks like the page text it sits in but is editable in
 * place — transparent background, inherits typography, shows a subtle dashed
 * affordance on hover and a clear focus ring. Multiline auto-grows to fit.
 */
export function Editable({
  value,
  onChange,
  placeholder,
  multiline,
  className,
  ariaLabel,
}: EditableProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (multiline && el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  });

  if (multiline) {
    return (
      <textarea
        ref={ref}
        rows={1}
        className={`ie ie-multiline ${className ?? ""}`}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <input
      className={`ie ${className ?? ""}`}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** In-place image swap — a floating button over the image that uploads a new
 *  file (re-encoded to WebP server-side) and updates the bound URL. */
export function InlineImage({
  onChange,
  label,
  dark,
}: {
  onChange: (url: string) => void;
  label: string;
  dark?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const { url } = await apiUpload<{ url: string }>("/admin/uploads", file);
      onChange(url);
    } catch (e) {
      setErr((e as Error).message || "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <span className="ie-img">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        style={{ display: "none" }}
        onChange={(e) => upload(e.target.files?.[0])}
      />
      <button
        type="button"
        className={`ie-img-btn ${dark ? "on-dark" : ""}`}
        disabled={busy}
        onClick={() => fileRef.current?.click()}
      >
        {busy ? "Uploading…" : `📷 ${label}`}
      </button>
      {err && <span className="ie-img-err">{err}</span>}
    </span>
  );
}
