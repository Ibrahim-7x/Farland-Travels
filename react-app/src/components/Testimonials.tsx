import { useEffect, useState } from "react";

type Review = {
  id: number;
  authorName: string;
  location: string | null;
  rating: number;
  body: string;
  createdAt: string;
};

/**
 * Customer reviews, fetched from the API. Renders nothing at all when there
 * are no published reviews (the seeded state) — no empty container, no gap.
 * No aggregate rating is shown; each card reflects a real returned row.
 */
export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Review[]) => {
        if (!cancelled && Array.isArray(data)) setReviews(data);
      })
      .catch(() => {
        /* leave empty — section stays hidden */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (reviews.length < 1) return null;

  return (
    <section id="testimonials" style={{ padding: "80px 0", background: "var(--ivory)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <h2 className="section-title">What our travellers say</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginTop: 32,
          }}
        >
          {reviews.map((r) => (
            <figure
              key={r.id}
              style={{
                background: "var(--white)",
                borderRadius: "var(--r-lg)",
                boxShadow: "var(--shadow-sm)",
                padding: 24,
                margin: 0,
              }}
            >
              <div aria-label={`${r.rating} out of 5`} style={{ color: "var(--gold)", letterSpacing: 2 }}>
                {"★".repeat(r.rating)}
                <span style={{ color: "var(--stone)" }}>{"★".repeat(5 - r.rating)}</span>
              </div>
              <blockquote
                style={{
                  margin: "12px 0 16px",
                  fontFamily: "var(--font-body)",
                  color: "var(--charcoal)",
                  lineHeight: 1.6,
                }}
              >
                {r.body}
              </blockquote>
              <figcaption style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--navy)" }}>
                {r.authorName}
                {r.location && (
                  <span style={{ fontWeight: 400, color: "var(--stone-dark)" }}> · {r.location}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
