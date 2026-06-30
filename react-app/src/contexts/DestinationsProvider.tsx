import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Destination } from "../data/destinations";
import {
  DestinationsContext,
  type DestinationsState,
} from "./destinationsContext";

/**
 * Fetches the published holiday deals and shares them with every public page.
 * While the FIRST load is in flight, `destinations` is empty and `loading` is
 * true so pages can show a neutral placeholder; on failure `error` is set.
 *
 * The list is also re-fetched whenever the tab regains focus / becomes visible,
 * so an edit made in the admin panel (typically open in another tab) shows on
 * the live site without a manual hard refresh. Re-fetches keep the existing
 * list on screen — they never flash an empty/loading state — and only flip
 * `error` on if there is nothing to show.
 */
export function DestinationsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DestinationsState>({
    destinations: [],
    loading: true,
    error: false,
  });

  const load = useCallback((isInitial: boolean) => {
    fetch("/api/destinations", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Destination[]) => {
        setState({
          destinations: Array.isArray(data) ? data : [],
          loading: false,
          error: false,
        });
      })
      .catch(() => {
        // On a background re-fetch, keep whatever is already on screen rather
        // than wiping it; only surface an error if we have nothing to show.
        setState((prev) => ({
          destinations: prev.destinations,
          loading: false,
          error: isInitial || prev.destinations.length === 0,
        }));
      });
  }, []);

  useEffect(() => {
    load(true);
  }, [load]);

  // Revalidate when the user returns to this tab/window — covers switching
  // back from the admin tab (focus / visibilitychange) and the browser Back
  // button restoring a cached page (pageshow with persisted = true).
  useEffect(() => {
    const revalidate = () => load(false);
    const onVisibility = () => {
      if (document.visibilityState === "visible") load(false);
    };
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) load(false);
    };
    window.addEventListener("focus", revalidate);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", revalidate);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  return (
    <DestinationsContext.Provider value={state}>
      {children}
    </DestinationsContext.Provider>
  );
}
