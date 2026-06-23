import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  SITE_SETTINGS_DEFAULTS,
  SiteSettingsContext,
  type SiteSettings,
} from "./siteSettings";

/**
 * Fetches public contact settings once on mount. While loading (or if the
 * request fails) values fall back to empty strings, so consumers render a
 * neutral placeholder rather than stale hard-coded contact details.
 *
 * The context, hook and link helpers live in ./siteSettings so this module
 * only exports a component (keeps React Fast Refresh happy).
 */
export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(SITE_SETTINGS_DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings/public")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Partial<SiteSettings> | null) => {
        if (!cancelled && data) {
          setSettings({ ...SITE_SETTINGS_DEFAULTS, ...data });
        }
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
