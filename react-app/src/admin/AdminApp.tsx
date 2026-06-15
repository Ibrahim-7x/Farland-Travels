import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { apiGet, apiPost } from "./api";
import { AuthContext, useAuth } from "./useAuth";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EnquiriesPage } from "./pages/EnquiriesPage";
import { EnquiryDetailPage } from "./pages/EnquiryDetailPage";
import { PackagesPage } from "./pages/PackagesPage";
import { PackageFormPage } from "./pages/PackageFormPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { ContentPage } from "./pages/ContentPage";
import { SettingsPage } from "./pages/SettingsPage";
import "./admin.css";

function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiGet<{ email: string }>("/auth/me")
      .then((data) => {
        if (!cancelled) setEmail(data.email);
      })
      .catch(() => {
        if (!cancelled) setEmail(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ email, loading, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

function RequireAuth() {
  const { email, loading } = useAuth();
  if (loading)
    return <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>;
  if (!email) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/enquiries", label: "Enquiries", end: false },
  { to: "/admin/packages", label: "Umrah Packages", end: false },
  { to: "/admin/reviews", label: "Reviews", end: false },
  { to: "/admin/content", label: "Content", end: false },
  { to: "/admin/settings", label: "Settings", end: false },
];

function AdminLayout() {
  const { email, setEmail } = useAuth();
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      await apiPost("/auth/logout");
    } catch {
      /* ignore */
    }
    setEmail(null);
    navigate("/admin/login", { replace: true });
  }, [navigate, setEmail]);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Farland<span> Admin</span>
        </div>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
        <div className="admin-sidebar-spacer" />
        <div className="admin-sidebar-email">{email}</div>
        <button type="button" className="admin-logout" onClick={logout}>
          Log out
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path="enquiries/:id" element={<EnquiryDetailPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="packages/new" element={<PackageFormPage />} />
            <Route path="packages/:id" element={<PackageFormPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
