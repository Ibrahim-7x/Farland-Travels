import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  DESTINATIONS,
  getAllMonths,
  getDestinationMonths,
  type Destination,
} from "../data/destinations";
import "./SearchBar.css";

type Variant = "hero" | "light";

type Props = {
  variant?: Variant;
  initialDestinationSlug?: string;
  initialMonth?: string;
  initialPersons?: number;
  onSubmitted?: () => void;
};

const MONTH_SHORT: Record<string, string> = {
  January: "JAN",
  February: "FEB",
  March: "MAR",
  April: "APR",
  May: "MAY",
  June: "JUN",
  July: "JUL",
  August: "AUG",
  September: "SEP",
  October: "OCT",
  November: "NOV",
  December: "DEC",
};

export function SearchBar({
  variant = "hero",
  initialDestinationSlug,
  initialMonth,
  initialPersons = 2,
  onSubmitted,
}: Props) {
  const navigate = useNavigate();

  const initialDest =
    (initialDestinationSlug &&
      DESTINATIONS.find((d) => d.slug === initialDestinationSlug)) ||
    null;

  const [selectedDest, setSelectedDest] = useState<Destination | null>(
    initialDest
  );
  const [destQuery, setDestQuery] = useState(initialDest?.name ?? "");
  const [destOpen, setDestOpen] = useState(false);
  const [destHighlight, setDestHighlight] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    initialMonth ?? null
  );
  const [monthOpen, setMonthOpen] = useState(false);

  const [persons, setPersons] = useState(
    Math.min(10, Math.max(1, initialPersons))
  );
  const [personsOpen, setPersonsOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const destFieldRef = useRef<HTMLDivElement>(null);
  const monthFieldRef = useRef<HTMLDivElement>(null);
  const personsFieldRef = useRef<HTMLDivElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);

  const [destPopStyle, setDestPopStyle] = useState<CSSProperties>({});
  const [monthPopStyle, setMonthPopStyle] = useState<CSSProperties>({});
  const [personsPopStyle, setPersonsPopStyle] = useState<CSSProperties>({});

  const computeDocStyle = (
    anchor: HTMLElement | null,
    minWidth: number
  ): CSSProperties | null => {
    if (!anchor) return null;
    const rect = anchor.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const width = Math.min(
      Math.max(rect.width, minWidth),
      window.innerWidth - 24
    );
    const rawLeft = rect.left + scrollX;
    const maxLeft = scrollX + window.innerWidth - width - 12;
    const left = Math.max(scrollX + 12, Math.min(rawLeft, maxLeft));
    return {
      position: "absolute",
      top: rect.bottom + scrollY + 8,
      left,
      width,
      zIndex: 9999,
    };
  };

  useLayoutEffect(() => {
    if (!destOpen) return;
    setDestPopStyle(computeDocStyle(destFieldRef.current, 320) ?? {});
  }, [destOpen]);

  useLayoutEffect(() => {
    if (!monthOpen) return;
    setMonthPopStyle(computeDocStyle(monthFieldRef.current, 260) ?? {});
  }, [monthOpen]);

  useLayoutEffect(() => {
    if (!personsOpen) return;
    setPersonsPopStyle(computeDocStyle(personsFieldRef.current, 240) ?? {});
  }, [personsOpen]);

  useEffect(() => {
    if (!destOpen && !monthOpen && !personsOpen) return;
    const close = () => {
      setDestOpen(false);
      setMonthOpen(false);
      setPersonsOpen(false);
    };
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [destOpen, monthOpen, personsOpen]);

  const filteredDestinations = useMemo(() => {
    const q = destQuery.trim().toLowerCase();
    if (!q || (selectedDest && destQuery === selectedDest.name)) {
      return DESTINATIONS;
    }
    return DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.regionLabel.toLowerCase().includes(q)
    );
  }, [destQuery, selectedDest]);

  const availableMonths = useMemo(() => {
    if (selectedDest) return getDestinationMonths(selectedDest);
    return getAllMonths();
  }, [selectedDest]);

  useEffect(() => {
    if (
      selectedMonth &&
      !availableMonths.includes(selectedMonth)
    ) {
      setSelectedMonth(null);
    }
  }, [availableMonths, selectedMonth]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest && t.closest(".sb-pop")) return;
      if (destFieldRef.current && !destFieldRef.current.contains(t)) {
        setDestOpen(false);
      }
      if (monthFieldRef.current && !monthFieldRef.current.contains(t)) {
        setMonthOpen(false);
      }
      if (personsFieldRef.current && !personsFieldRef.current.contains(t)) {
        setPersonsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (destOpen) setDestHighlight(0);
  }, [destQuery, destOpen]);

  const selectDestination = (d: Destination) => {
    setSelectedDest(d);
    setDestQuery(d.name);
    setDestOpen(false);
    setError(null);
  };

  const clearDestination = () => {
    setSelectedDest(null);
    setDestQuery("");
    setDestOpen(true);
    destInputRef.current?.focus();
  };

  const onDestKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!destOpen) setDestOpen(true);
      setDestHighlight((h) =>
        Math.min(filteredDestinations.length - 1, h + 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setDestHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      if (destOpen && filteredDestinations[destHighlight]) {
        e.preventDefault();
        selectDestination(filteredDestinations[destHighlight]);
      }
    } else if (e.key === "Escape") {
      setDestOpen(false);
    }
  };

  const onSearch = () => {
    if (!selectedDest) {
      setError("Please select a destination");
      setShake(true);
      setDestOpen(true);
      destInputRef.current?.focus();
      window.setTimeout(() => setShake(false), 450);
      return;
    }
    setError(null);
    const params = new URLSearchParams();
    params.set("destination", selectedDest.slug);
    if (selectedMonth) params.set("month", MONTH_SHORT[selectedMonth] ?? selectedMonth.slice(0, 3).toUpperCase());
    params.set("persons", String(persons));
    navigate(`/search-results?${params.toString()}`);
    onSubmitted?.();
  };

  const personsSummary = persons === 1 ? "1 Adult" : `${persons} Adults`;

  return (
    <form
      className={`sb sb-${variant}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      {/* Destination */}
      <div
        ref={destFieldRef}
        className={`sb-field sb-dest ${shake ? "sb-shake" : ""} ${
          error ? "sb-has-error" : ""
        }`}
      >
        <label htmlFor="sb-destination">Destination</label>
        <div className="sb-input-row">
          <input
            id="sb-destination"
            ref={destInputRef}
            type="text"
            autoComplete="off"
            placeholder="Where do you dream of going?"
            value={destQuery}
            onChange={(e) => {
              setDestQuery(e.target.value);
              if (selectedDest && e.target.value !== selectedDest.name) {
                setSelectedDest(null);
              }
              setDestOpen(true);
            }}
            onFocus={() => setDestOpen(true)}
            onKeyDown={onDestKeyDown}
            aria-expanded={destOpen}
            aria-autocomplete="list"
            aria-haspopup="listbox"
          />
          {selectedDest && (
            <button
              type="button"
              className="sb-clear"
              aria-label="Clear destination"
              onClick={clearDestination}
            >
              ×
            </button>
          )}
        </div>
        {error && <div className="sb-error-tip">{error}</div>}
        {destOpen &&
          createPortal(
            <div
              className="sb-pop sb-pop-dest"
              role="listbox"
              style={destPopStyle}
            >
              {filteredDestinations.length === 0 ? (
                <div className="sb-empty">
                  No destinations match "{destQuery}"
                </div>
              ) : (
                filteredDestinations.map((d, i) => (
                  <button
                    type="button"
                    key={d.slug}
                    role="option"
                    aria-selected={i === destHighlight}
                    className={`sb-opt ${i === destHighlight ? "active" : ""} ${
                      selectedDest?.slug === d.slug ? "selected" : ""
                    }`}
                    onMouseEnter={() => setDestHighlight(i)}
                    onClick={() => selectDestination(d)}
                  >
                    <div className="sb-opt-main">
                      <strong>{d.name}</strong>
                      <span className="sb-opt-region">{d.region}</span>
                    </div>
                    <span className="sb-opt-price">From {d.fromPrice}</span>
                  </button>
                ))
              )}
            </div>,
            document.body
          )}
      </div>

      {/* Date / Month */}
      <div ref={monthFieldRef} className="sb-field sb-date">
        <label>Departure month</label>
        <button
          type="button"
          className="sb-trigger"
          onClick={() => setMonthOpen((o) => !o)}
          aria-expanded={monthOpen}
        >
          {selectedMonth ? (
            <span className="sb-value">{selectedMonth}</span>
          ) : (
            <span className="sb-placeholder">Select month</span>
          )}
          <span className="sb-caret" aria-hidden="true">▾</span>
        </button>
        {monthOpen &&
          createPortal(
            <div className="sb-pop sb-pop-month" style={monthPopStyle}>
              <div className="sb-pop-title">
                {selectedDest
                  ? `Available for ${selectedDest.name}`
                  : "Across all destinations"}
              </div>
              <div className="sb-month-chips">
                {availableMonths.map((m) => (
                  <button
                    type="button"
                    key={m}
                    className={`sb-chip ${selectedMonth === m ? "active" : ""}`}
                    onClick={() => {
                      setSelectedMonth(m);
                      setMonthOpen(false);
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )}
      </div>

      {/* Persons */}
      <div ref={personsFieldRef} className="sb-field sb-persons">
        <label>Persons</label>
        <button
          type="button"
          className="sb-trigger"
          onClick={() => setPersonsOpen((o) => !o)}
          aria-expanded={personsOpen}
        >
          <span className="sb-value">{personsSummary}</span>
          <span className="sb-caret" aria-hidden="true">▾</span>
        </button>
        {personsOpen &&
          createPortal(
            <div className="sb-pop sb-pop-persons" style={personsPopStyle}>
              <div className="sb-stepper">
                <div className="sb-step-label">
                  <strong>Adults</strong>
                  <small>Age 12+</small>
                </div>
                <div className="sb-step-ctrl">
                  <button
                    type="button"
                    className="sb-step-btn"
                    aria-label="Decrease adults"
                    disabled={persons <= 1}
                    onClick={() => setPersons((p) => Math.max(1, p - 1))}
                  >
                    −
                  </button>
                  <span className="sb-step-count">{persons}</span>
                  <button
                    type="button"
                    className="sb-step-btn"
                    aria-label="Increase adults"
                    disabled={persons >= 10}
                    onClick={() => setPersons((p) => Math.min(10, p + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="sb-step-done">
                <button
                  type="button"
                  className="sb-done-btn"
                  onClick={() => setPersonsOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>,
            document.body
          )}
      </div>

      {/* Submit */}
      <div className="sb-submit-wrap">
        <button type="submit" className="btn btn-gold sb-submit">
          Search ↗
        </button>
      </div>
    </form>
  );
}
