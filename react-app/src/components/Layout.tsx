import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { useReveal } from "../hooks/useReveal";

export function Layout() {
  const { pathname, hash } = useLocation();
  useReveal();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}
