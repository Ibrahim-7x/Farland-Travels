import { Link } from "react-router-dom";
import { useSiteSettings, telHref } from "../contexts/siteSettings";

export function Footer() {
  const { contactPhone, contactEmail, address } = useSiteSettings();
  const phoneLink = telHref(contactPhone);
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">
              Farland<span> Holidays</span>
            </div>
            <p className="footer-desc">
              Crafting extraordinary journeys for the world's most discerning travellers.
              Every trip, a story worth telling.
            </p>
            {(contactPhone || contactEmail || address) && (
              <ul
                className="footer-contact"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "14px 0 0",
                  display: "grid",
                  gap: 6,
                  fontSize: 13,
                }}
              >
                {contactPhone && (
                  <li>
                    {phoneLink ? <a href={phoneLink}>{contactPhone}</a> : contactPhone}
                  </li>
                )}
                {contactEmail && (
                  <li>
                    <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                  </li>
                )}
                {address && <li>{address}</li>}
              </ul>
            )}
            <div className="footer-socials">
              <div className="fsoc">in</div>
              <div className="fsoc">ig</div>
              <div className="fsoc">yt</div>
              <div className="fsoc">fb</div>
              <div className="fsoc">pt</div>
            </div>
          </div>
          <div>
            <div className="footer-col-label">Destinations</div>
            <ul className="footer-links">
              <li><Link to="/destinations/singapore-bali">Singapore &amp; Bali</Link></li>
              <li><Link to="/destinations/dubai-bali">Dubai &amp; Bali</Link></li>
              <li><Link to="/destinations/bali-long-stay">Bali Long Stay</Link></li>
              {/* <li><Link to="/destinations/makkah-madinah">Makkah &amp; Madinah</Link></li> */}
              <li><Link to="/destinations">All destinations</Link></li>
              <li><Link to="/deals">Current deals</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-label">Company</div>
            <ul className="footer-links">
              <li><Link to="/about">About Farland</Link></li>
              <li><Link to="/about">Meet the experts</Link></li>
              <li><Link to="/about">Sustainability</Link></li>
              <li><Link to="/about">Press &amp; media</Link></li>
              <li><Link to="/about">Careers</Link></li>
              <li><Link to="/about">Partnerships</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-label">Help</div>
            <ul className="footer-links">
              <li><Link to="/contact">Contact us</Link></li>
              <li><Link to="/contact">FAQs</Link></li>
              <li><Link to="/contact">How to book</Link></li>
              <li><Link to="/contact">Travel insurance</Link></li>
              <li><Link to="/terms">Terms &amp; conditions</Link></li>
              <li><Link to="/privacy">Privacy policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <div className="footer-legal">
            © {new Date().getFullYear()} Farland Holidays
          </div>
        </div>
      </div>
    </footer>
  );
}
