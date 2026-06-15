import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";
import { useAuth } from "../useAuth";

export function LoginPage() {
  const { setEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await apiPost<{ email: string }>("/auth/login", {
        email,
        password,
      });
      setEmail(res.email);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-logo" style={{ padding: "0 0 16px", color: "var(--navy)" }}>
          Farland<span style={{ color: "var(--btn-blue)" }}> Admin</span>
        </div>
        <p className="admin-sub">Sign in to manage the site.</p>
        <label className="admin-field">
          <span>Email</span>
          <input
            className="admin-input"
            type="email"
            value={email}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <input
            className="admin-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && <div className="admin-error" role="alert">{error}</div>}
        <button className="admin-btn" type="submit" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
