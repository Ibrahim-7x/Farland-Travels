import { useEffect, useState } from "react";
import { marked } from "marked";

type ContentDoc = { key: string; title: string; body: string };
type Status = "loading" | "error" | "ready";

/** Fetches a DB-managed legal/content page and renders its markdown body. */
export function LegalContent({
  contentKey,
}: {
  contentKey: "privacy_policy" | "terms";
}) {
  const [doc, setDoc] = useState<ContentDoc | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/content/${contentKey}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ContentDoc>;
      })
      .then((data) => {
        if (cancelled) return;
        setDoc(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [contentKey]);

  return (
    <main
      className="legal-page"
      style={{ maxWidth: 820, margin: "0 auto", padding: "120px 24px 80px" }}
    >
      {status === "loading" && <p>Loading…</p>}
      {status === "error" && (
        <p>Unable to load this page. Please try again later.</p>
      )}
      {status === "ready" && doc && (
        <article className="legal-content">
          <h1
            style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
          >
            {doc.title}
          </h1>
          {/* Content is authored by an authenticated admin (trusted source). */}
          <div
            dangerouslySetInnerHTML={{ __html: marked.parse(doc.body) as string }}
          />
        </article>
      )}
    </main>
  );
}
