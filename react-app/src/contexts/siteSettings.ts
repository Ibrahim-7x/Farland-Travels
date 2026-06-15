import { createContext, useContext } from "react";

export type SiteSettings = {
  businessName: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  address: string;
};

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  businessName: "",
  contactPhone: "",
  contactWhatsapp: "",
  contactEmail: "",
  address: "",
};

export const SiteSettingsContext = createContext<SiteSettings>(
  SITE_SETTINGS_DEFAULTS,
);

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}

/**
 * Builds a wa.me link from the SAME stored WhatsApp value used for display,
 * so the link and the visible number can never diverge. Returns null when no
 * number is configured (caller should then hide the WhatsApp affordance).
 */
export function whatsappHref(whatsapp: string, text?: string): string | null {
  const digits = whatsapp.replace(/[^0-9]/g, "");
  if (!digits) return null;
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Builds a tel: link from the same stored phone value used for display. */
export function telHref(phone: string): string | null {
  const cleaned = phone.replace(/[^0-9+]/g, "");
  return cleaned ? `tel:${cleaned}` : null;
}
