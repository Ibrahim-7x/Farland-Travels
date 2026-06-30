import { useMemo, useState } from "react";
import type {
  Destination,
  WhatsIncludedImage,
  WhatsIncludedTab,
} from "../data/destinations";
import "./WhatsIncludedTabs.css";

type Props = {
  destination: Destination;
  // Legacy props, kept so existing call sites (e.g. the Search Results page)
  // keep compiling. The per-package picker was removed when the section became
  // fully admin-driven; these are accepted but ignored.
  selectedPackageIndex?: number;
  onPackageChange?: (index: number) => void;
};

/**
 * Resolve the tabs to render. Prefer the admin-managed `whatsIncluded`
 * structure; if a deal only has the older flat `components` list, fall back to
 * a single generic tab so the section is never empty.
 */
function resolveTabs(dest: Destination): WhatsIncludedTab[] {
  const wit = (dest.whatsIncluded ?? []).filter(
    (t) => t.label.trim() || t.sections.length > 0,
  );
  if (wit.length > 0) return wit;

  const components = dest.components ?? [];
  if (components.length === 0) return [];
  return [
    {
      id: "included",
      label: "What's included",
      flag: "✓",
      sections: [
        {
          icon: "🧳",
          title: "Package components",
          items: components.map((c) => ({ label: c.label, primary: c.details })),
          images: [],
        },
      ],
    },
  ];
}

function SectionSlideshow({
  images,
  sectionId,
}: {
  images: WhatsIncludedImage[];
  sectionId: string;
}) {
  const [idx, setIdx] = useState(0);
  const [prevSectionId, setPrevSectionId] = useState(sectionId);

  if (sectionId !== prevSectionId) {
    setIdx(0);
    setPrevSectionId(sectionId);
  }

  const total = images.length;
  const go = (next: number) => setIdx(((next % total) + total) % total);

  return (
    <div className="wit-slideshow">
      <div className="wit-slide-stage">
        {images.map((img, i) => (
          <figure
            key={`${img.src}-${i}`}
            className={`wit-slide ${i === idx ? "active" : ""}`}
            aria-hidden={i !== idx}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
          </figure>
        ))}
        {total > 1 && (
          <>
            <button
              type="button"
              className="wit-slide-arrow prev"
              onClick={() => go(idx - 1)}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className="wit-slide-arrow next"
              onClick={() => go(idx + 1)}
              aria-label="Next photo"
            >
              ›
            </button>
            <div className="wit-slide-counter">
              {idx + 1} / {total}
            </div>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="wit-slide-dots" role="tablist">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-label={`Photo ${i + 1}`}
              className={`wit-slide-dot ${i === idx ? "active" : ""}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Renders a deal's "What's Included" from its admin-managed data — a tabbed
 * card (one tab per leg/city), each tab grouped into sections with bullet
 * lines, pills, and an optional photo slideshow. Edits in the admin panel flow
 * straight through. Returns null when a deal has no content yet.
 */
export function WhatsIncludedTabs({ destination }: Props) {
  const tabs = useMemo(() => resolveTabs(destination), [destination]);

  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? "");
  const baseKey = `${destination.slug}-${tabs.length}`;
  const [prevBaseKey, setPrevBaseKey] = useState(baseKey);
  if (prevBaseKey !== baseKey) {
    setActiveId(tabs[0]?.id ?? "");
    setPrevBaseKey(baseKey);
  }

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  if (!active) return null;

  return (
    <div className="wit-card">
      <div className="wit-card-header">
        <h3>What's Included</h3>
        <div className="wit-from-tag">
          From <strong>{destination.fromPrice}</strong>
          <span>per person</span>
        </div>
      </div>

      {tabs.length > 1 && (
        <div className="wit-tabs-bar">
          <div className="wit-tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={t.id === active.id}
                className={`wit-tab ${t.id === active.id ? "active" : ""}`}
                onClick={() => setActiveId(t.id)}
              >
                {t.flag && (
                  <span className="wit-tab-flag" aria-hidden="true">
                    {t.flag}
                  </span>
                )}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="wit-content"
        key={`${destination.slug}-${active.id}`}
        role="tabpanel"
      >
        {active.sections.map((s, i) => (
          <div key={i} className="wit-section">
            <div className="wit-sec-header">
              {s.icon && (
                <span className="wit-sec-icon" aria-hidden="true">
                  {s.icon}
                </span>
              )}
              <span className="wit-sec-title">{s.title}</span>
            </div>
            <div className="wit-sec-divider" />
            <div className="wit-sec-items">
              {s.items.map((it, j) => (
                <div key={j} className="wit-item">
                  {it.label && <div className="wit-item-label">{it.label}</div>}
                  {it.primary && (
                    <div className="wit-item-primary">{it.primary}</div>
                  )}
                  {it.pills && it.pills.length > 0 && (
                    <div className="wit-item-pills">
                      {it.pills.map((p, k) => (
                        <span key={k} className="wit-pill">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {s.images && s.images.length > 0 && (
              <SectionSlideshow
                images={s.images}
                sectionId={`${active.id}-${i}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
