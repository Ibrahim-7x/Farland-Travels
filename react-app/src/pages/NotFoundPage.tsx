import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export function NotFoundPage() {
  return (
    <div className="nf-hero">
      <div className="nf-content">
        <div className="nf-eyebrow">Error 404</div>
        <h1 className="nf-title">
          This Page Has
          <br />
          <em>Wandered Off</em>
        </h1>
        <p className="nf-sub">
          The page you're looking for doesn't exist or may have moved. Let's
          get you back to somewhere beautiful.
        </p>
        <div className="nf-actions">
          <Link to="/" className="btn btn-gold">
            Back to home ↗
          </Link>
          <Link to="/destinations" className="btn btn-outline-white">
            Browse destinations
          </Link>
        </div>
      </div>
    </div>
  );
}
