import type {
  WhatsIncludedImage,
  WhatsIncludedItem,
  WhatsIncludedSection,
  WhatsIncludedTab,
} from "../../data/destinations";
import { ImageUpload } from "./ImageUpload";

type Props = {
  tabs: WhatsIncludedTab[];
  onChange: (tabs: WhatsIncludedTab[]) => void;
};

/**
 * Structured editor for a deal's "What's Included" card. Mirrors what the
 * public page renders: tabs (legs/cities) → sections (Flights, Hotel…) →
 * bullet lines (label / headline / pills) and a photo gallery per section.
 * Everything here saves with the deal and appears verbatim on the live page.
 */
export function WhatsIncludedEditor({ tabs, onChange }: Props) {
  // Immutable updates — each handler rebuilds from the current `tabs` prop and
  // fires a single onChange.
  const patchTab = (ti: number, patch: Partial<WhatsIncludedTab>) =>
    onChange(tabs.map((t, i) => (i === ti ? { ...t, ...patch } : t)));

  const patchSection = (
    ti: number,
    si: number,
    patch: Partial<WhatsIncludedSection>,
  ) =>
    patchTab(ti, {
      sections: tabs[ti].sections.map((s, i) =>
        i === si ? { ...s, ...patch } : s,
      ),
    });

  const patchItem = (
    ti: number,
    si: number,
    ii: number,
    patch: Partial<WhatsIncludedItem>,
  ) =>
    patchSection(ti, si, {
      items: tabs[ti].sections[si].items.map((it, i) =>
        i === ii ? { ...it, ...patch } : it,
      ),
    });

  const patchImage = (
    ti: number,
    si: number,
    gi: number,
    patch: Partial<WhatsIncludedImage>,
  ) =>
    patchSection(ti, si, {
      images: (tabs[ti].sections[si].images ?? []).map((g, i) =>
        i === gi ? { ...g, ...patch } : g,
      ),
    });

  const addTab = () =>
    onChange([...tabs, { id: "", label: "", flag: "", sections: [] }]);
  const removeTab = (ti: number) => onChange(tabs.filter((_, i) => i !== ti));

  const addSection = (ti: number) =>
    patchTab(ti, {
      sections: [
        ...tabs[ti].sections,
        { icon: "", title: "", items: [], images: [] },
      ],
    });
  const removeSection = (ti: number, si: number) =>
    patchTab(ti, { sections: tabs[ti].sections.filter((_, i) => i !== si) });

  const addItem = (ti: number, si: number) =>
    patchSection(ti, si, {
      items: [
        ...tabs[ti].sections[si].items,
        { label: "", primary: "", pills: [] },
      ],
    });
  const removeItem = (ti: number, si: number, ii: number) =>
    patchSection(ti, si, {
      items: tabs[ti].sections[si].items.filter((_, i) => i !== ii),
    });

  const addImage = (ti: number, si: number) =>
    patchSection(ti, si, {
      images: [...(tabs[ti].sections[si].images ?? []), { src: "", alt: "" }],
    });
  const removeImage = (ti: number, si: number, gi: number) =>
    patchSection(ti, si, {
      images: (tabs[ti].sections[si].images ?? []).filter((_, i) => i !== gi),
    });

  return (
    <div className="wit-ed">
      {tabs.length === 0 && (
        <p className="admin-muted" style={{ margin: "0 0 10px" }}>
          No tabs yet. Add one tab per leg or city (e.g. “Singapore”, “Bali”).
          Single-destination deals can use just one tab.
        </p>
      )}

      {tabs.map((tab, ti) => (
        <div className="wit-ed-tab" key={ti}>
          <div className="wit-ed-tab-head">
            <input
              className="admin-input wit-ed-flag"
              value={tab.flag}
              onChange={(e) => patchTab(ti, { flag: e.target.value })}
              placeholder="🇸🇬"
              aria-label="Tab flag / emoji"
            />
            <input
              className="admin-input wit-ed-tab-label"
              value={tab.label}
              onChange={(e) => patchTab(ti, { label: e.target.value })}
              placeholder="Tab name (e.g. Singapore)"
              aria-label="Tab name"
            />
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => removeTab(ti)}
            >
              Remove tab
            </button>
          </div>

          {tab.sections.map((section, si) => (
            <div className="wit-ed-section" key={si}>
              <div className="wit-ed-section-head">
                <input
                  className="admin-input wit-ed-icon"
                  value={section.icon}
                  onChange={(e) => patchSection(ti, si, { icon: e.target.value })}
                  placeholder="🏨"
                  aria-label="Section icon"
                />
                <input
                  className="admin-input wit-ed-section-title"
                  value={section.title}
                  onChange={(e) =>
                    patchSection(ti, si, { title: e.target.value })
                  }
                  placeholder="Section title (e.g. Hotel)"
                  aria-label="Section title"
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => removeSection(ti, si)}
                >
                  Remove section
                </button>
              </div>

              {/* Lines */}
              <div className="wit-ed-items">
                {section.items.map((item, ii) => (
                  <div className="wit-ed-item" key={ii}>
                    <div className="wit-ed-item-fields">
                      <input
                        className="admin-input"
                        value={item.label ?? ""}
                        onChange={(e) =>
                          patchItem(ti, si, ii, { label: e.target.value })
                        }
                        placeholder="Small label (optional, e.g. To Singapore)"
                        aria-label="Line label"
                      />
                      <input
                        className="admin-input"
                        value={item.primary ?? ""}
                        onChange={(e) =>
                          patchItem(ti, si, ii, { primary: e.target.value })
                        }
                        placeholder="Headline (e.g. Furama Riverfront)"
                        aria-label="Line headline"
                      />
                      <input
                        className="admin-input"
                        value={(item.pills ?? []).join(", ")}
                        onChange={(e) =>
                          patchItem(ti, si, ii, {
                            pills: e.target.value
                              .split(",")
                              .map((p) => p.trimStart()),
                          })
                        }
                        placeholder="Pills, comma-separated (e.g. Superior Room, Breakfast, 04 Nights)"
                        aria-label="Line pills"
                      />
                    </div>
                    <button
                      type="button"
                      className="ie-remove"
                      onClick={() => removeItem(ti, si, ii)}
                      aria-label="Remove line"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="iedeal-add"
                  onClick={() => addItem(ti, si)}
                >
                  + Add line
                </button>
              </div>

              {/* Photos */}
              <div className="wit-ed-images">
                {(section.images ?? []).map((img, gi) => (
                  <div className="wit-ed-image" key={gi}>
                    <ImageUpload
                      label={`Photo ${gi + 1}`}
                      value={img.src}
                      onChange={(url) => patchImage(ti, si, gi, { src: url })}
                    />
                    <div className="wit-ed-image-foot">
                      <input
                        className="admin-input"
                        value={img.alt}
                        onChange={(e) =>
                          patchImage(ti, si, gi, { alt: e.target.value })
                        }
                        placeholder="Photo description (alt text)"
                        aria-label="Photo description"
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => removeImage(ti, si, gi)}
                      >
                        Remove photo
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="iedeal-add"
                  onClick={() => addImage(ti, si)}
                >
                  + Add photo
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="iedeal-add wit-ed-add-section"
            onClick={() => addSection(ti)}
          >
            + Add section
          </button>
        </div>
      ))}

      <button type="button" className="iedeal-add" onClick={addTab}>
        + Add tab
      </button>
    </div>
  );
}
