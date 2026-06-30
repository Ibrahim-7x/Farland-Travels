import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Fades `.reveal` elements in as they scroll into view, re-arming on every
 * route change.
 *
 * Some pages render their `.reveal` sections only *after* an async fetch
 * resolves — e.g. the destination detail page on a hard refresh, where the
 * content replaces a "Loading…" placeholder once `/api/destinations` returns.
 * Those late sections aren't in the DOM when the route first mounts, so a
 * one-shot querySelectorAll would miss them and they'd stay stuck at
 * `opacity: 0` (the "details disappear on refresh" bug). A MutationObserver
 * therefore keeps observing nodes added later, not just the initial set.
 */
export function useReveal(threshold = 0.12): void {
  const { pathname } = useLocation();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold },
    );

    // Observe every reveal element that hasn't been revealed yet. Safe to call
    // repeatedly — re-observing the same node is a no-op.
    const observePending = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.visible)")
        .forEach((el) => io.observe(el));
    };

    // Fresh route: clear any stale state, then observe what's already here.
    document
      .querySelectorAll<HTMLElement>(".reveal")
      .forEach((el) => el.classList.remove("visible"));
    observePending();

    // …and keep observing `.reveal` nodes that get added later (async content).
    const mo = new MutationObserver(observePending);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname, threshold]);
}
