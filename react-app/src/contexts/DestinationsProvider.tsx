import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Destination } from "../data/destinations";
import {
  DestinationsContext,
  type DestinationsState,
} from "./destinationsContext";

/**
 * Fetches the published holiday deals once on mount and shares them with every
 * public page. While loading, `destinations` is empty and `loading` is true so
 * pages can show a neutral placeholder; on failure `error` is set and the list
 * stays empty (pages degrade gracefully rather than crash).
 */
export function DestinationsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DestinationsState>({
    destinations: [],
    loading: true,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/destinations")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Destination[]) => {
        if (!cancelled) {
          setState({
            destinations: Array.isArray(data) ? data : [],
            loading: false,
            error: false,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ destinations: [], loading: false, error: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DestinationsContext.Provider value={state}>
      {children}
    </DestinationsContext.Provider>
  );
}
