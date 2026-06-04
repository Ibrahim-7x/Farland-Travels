import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useScrollSolid } from "../hooks/useScrollSolid";
import { DESTINATIONS } from "../data/destinations";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active" : undefined;

type DropdownKey = "destinations" | "deals" | null;

type FilterPill = {
  label: string;
  to: string;
  emoji?: string;
};

type FilterGroup = {
  label: string;
  pills: FilterPill[];
};

/**
 * DESTINATIONS dropdown — explore/filter pills.
 * Every pill stays inside /destinations (hash anchors + query params).
 */
const DESTINATIONS_GROUPS: FilterGroup[] = [
  {
    label: "Continent",
    pills: [
      { label: "Asia", to: "/destinations#continent-asia", emoji: "🌏" },
      { label: "Middle East", to: "/destinations#continent-middle-east", emoji: "🕌" },
      { label: "Europe", to: "/destinations#continent-europe", emoji: "🏰" },
      { label: "Americas", to: "/destinations#continent-americas", emoji: "🗽" },
      { label: "Africa", to: "/destinations#continent-africa", emoji: "🦁" },
      { label: "Oceania", to: "/destinations#continent-oceania", emoji: "🏝" },
    ],
  },
  {
    label: "Travel Style",
    pills: [
      { label: "Beach", to: "/destinations?style=beach", emoji: "🏖" },
      { label: "Culture", to: "/destinations?style=culture", emoji: "🏛" },
      { label: "Adventure", to: "/destinations?style=adventure", emoji: "🧭" },
      { label: "Wellness", to: "/destinations?style=wellness", emoji: "🧘" },
      { label: "Family", to: "/destinations?style=family", emoji: "👨‍👩‍👧" },
      { label: "Spiritual", to: "/destinations?style=spiritual", emoji: "🕌" },
    ],
  },
  {
    label: "Popular Cities",
    pills: [
      { label: "Bali", to: "/destinations?city=Bali" },
      { label: "Singapore", to: "/destinations?city=Singapore" },
      { label: "Dubai", to: "/destinations?city=Dubai" },
      { label: "Tokyo", to: "/destinations?city=Tokyo" },
      { label: "Paris", to: "/destinations?city=Paris" },
      { label: "Sydney", to: "/destinations?city=Sydney" },
    ],
  },
  {
    label: "Departure",
    pills: [
      { label: "May", to: "/destinations?month=May" },
      { label: "June", to: "/destinations?month=June" },
      { label: "September", to: "/destinations?month=September" },
      { label: "October", to: "/destinations?month=October" },
    ],
  },
];

/**
 * DEALS dropdown — quick category chips + real deal cards.
 * Every link stays inside /deals or jumps to a deal's detail page.
 */
const DEAL_CATEGORY_CHIPS: FilterPill[] = [
  { label: "All Deals", to: "/deals" },
  { label: "Beach", to: "/deals?cat=beach", emoji: "🏖" },
  { label: "Culture", to: "/deals?cat=culture", emoji: "🏛" },
  { label: "Family", to: "/deals?cat=family", emoji: "👨‍👩‍👧" },
  { label: "Honeymoon", to: "/deals?cat=honeymoon", emoji: "💍" },
  { label: "Wellness", to: "/deals?cat=wellness", emoji: "🧘" },
];

function dealDuration(d: (typeof DESTINATIONS)[number]): string {
  const first = d.metaItems?.[0];
  if (first && /^\d+/.test(first.strong)) {
    return `${first.strong} ${first.rest}`;
  }
  return d.tags?.find((t) => /night/i.test(t)) ?? "";
}

export function Nav() {
  const solid = useScrollSolid(60);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    const onResize = () => {
      if (window.innerWidth > 860) setMenuOpen(false);
      if (window.innerWidth <= 860) setOpenDropdown(null);
    };
    document.addEventListener("click", onClickOutside);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("click", onClickOutside);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const cancelClose = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 160);
  };

  const openMega = (key: DropdownKey) => {
    if (window.innerWidth <= 860) return;
    cancelClose();
    setOpenDropdown(key);
  };

  const handleNav = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    setOpenDropdown(null);
    navigate(to);
  };

  const navClassName = [
    solid ? "solid" : "",
    menuOpen ? "nav-open" : "",
    openDropdown ? "mega-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderDestinationsMega = () => (
    <div
      className={`mega-dropdown mega-destinations ${
        openDropdown === "destinations" ? "open" : ""
      }`}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      role="menu"
      aria-hidden={openDropdown !== "destinations"}
    >
      <div className="mega-inner">
        <div className="mega-eyebrow">Explore by continent, theme or city</div>
        <div className="mega-filter-row">
          {DESTINATIONS_GROUPS.map((group) => (
            <div className="mega-group" key={group.label}>
              <div className="mega-group-label">{group.label}</div>
              <div className="mega-pills">
                {group.pills.map((pill) => (
                  <a
                    key={pill.label}
                    href={pill.to}
                    className="mega-pill"
                    onClick={(e) => handleNav(e, pill.to)}
                  >
                    {pill.emoji && (
                      <span className="mega-pill-emoji" aria-hidden="true">
                        {pill.emoji}
                      </span>
                    )}
                    <span>{pill.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mega-footer">
          <Link
            to="/destinations"
            className="mega-footer-link"
            onClick={() => setOpenDropdown(null)}
          >
            Explore all destinations →
          </Link>
          <span className="mega-footer-meta">
            32 cities · 6 continents · curated journeys
          </span>
        </div>
      </div>
    </div>
  );

  const renderDealsMega = () => {
    const visibleDeals = DESTINATIONS.slice(0, 8);
    return (
      <div
        className={`mega-dropdown mega-deals ${
          openDropdown === "deals" ? "open" : ""
        }`}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        role="menu"
        aria-hidden={openDropdown !== "deals"}
      >
        <div className="mega-inner">
          <div className="mega-eyebrow">
            Featured Deals · {DESTINATIONS.length} curated packages
          </div>

          <div className="deals-mega-cats">
            {DEAL_CATEGORY_CHIPS.map((chip) => (
              <a
                key={chip.label}
                href={chip.to}
                className="mega-pill"
                onClick={(e) => handleNav(e, chip.to)}
              >
                {chip.emoji && (
                  <span className="mega-pill-emoji" aria-hidden="true">
                    {chip.emoji}
                  </span>
                )}
                <span>{chip.label}</span>
              </a>
            ))}
          </div>

          <div className="deals-mega-section-label">Popular right now</div>
          <div className="deals-mega-grid">
            {visibleDeals.map((d) => (
              <a
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="deals-mega-card"
                onClick={(e) => handleNav(e, `/destinations/${d.slug}`)}
              >
                <div className="deals-mega-thumb">
                  <img src={d.image} alt={d.name} loading="lazy" />
                </div>
                <div className="deals-mega-body">
                  <div className="deals-mega-region">{d.regionLabel}</div>
                  <div className="deals-mega-name">{d.name}</div>
                  <div className="deals-mega-meta">
                    {dealDuration(d) && <span>{dealDuration(d)}</span>}
                    {dealDuration(d) && <span className="deals-mega-dot">·</span>}
                    <span>from {d.fromPrice}</span>
                  </div>
                  <span className="deals-mega-cta">View Deal →</span>
                </div>
              </a>
            ))}
          </div>

          <div className="mega-footer">
            <Link
              to="/deals"
              className="mega-footer-link"
              onClick={() => setOpenDropdown(null)}
            >
              View all deals →
            </Link>
            <span className="mega-footer-meta">
              Fully protected · transparent pricing · no booking fees
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav id="site-nav" className={navClassName} ref={navRef}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Farland<span> Holidays</span>
        </Link>
        <ul className="nav-links" id="primary-nav">
          <li>
            <NavLink to="/" end className={linkClass} onClick={closeMenu} aria-label="Home">
              <svg
                className="nav-home-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5 10.5V20h4.5v-5h5v5H19V10.5" />
              </svg>
            </NavLink>
          </li>
          <li
            className={`nav-mega-trigger ${openDropdown === "destinations" ? "active" : ""}`}
            onMouseEnter={() => openMega("destinations")}
            onMouseLeave={scheduleClose}
          >
            <NavLink to="/destinations" className={linkClass} onClick={closeMenu}>
              Destinations
              <span className="nav-caret" aria-hidden="true">▾</span>
            </NavLink>
            {renderDestinationsMega()}
          </li>
          <li
            className={`nav-mega-trigger ${openDropdown === "deals" ? "active" : ""}`}
            onMouseEnter={() => openMega("deals")}
            onMouseLeave={scheduleClose}
          >
            <NavLink to="/deals" className={linkClass} onClick={closeMenu}>
              Deals
              <span className="nav-caret" aria-hidden="true">▾</span>
            </NavLink>
            {renderDealsMega()}
          </li>
          <li>
            <NavLink to="/about" className={linkClass} onClick={closeMenu}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={linkClass} onClick={closeMenu}>
              Contact
            </NavLink>
          </li>
        </ul>
        <div className="nav-right">
          <Link
            to="/contact#inquiry-section"
            className="btn btn-gold"
            style={{ padding: "10px 20px", fontSize: 10 }}
          >
            Plan my trip ↗
          </Link>
        </div>
        <button
          className="nav-hamburger"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
