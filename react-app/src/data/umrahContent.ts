/* ─────────────────────────────────────────────────────────────────
   Umrah types + static presentation helpers used by the Umrah page's
   cards and details modal. The package DATA itself now lives in the
   database and is fetched from GET /api/umrah-packages — only the
   shared types and display-only content remain here.
   ───────────────────────────────────────────────────────────────── */

export type UmrahTier = "Economy" | "Premium" | "VIP";

export type UmrahRoomRate = {
  room: string; // "Quad" | "Triple" | "Double"
  priceDisplay: string; // per person, e.g. "A$1,875"
};

export type UmrahFlight = {
  airline: string;
  routing: string;
};

/** Canonical inclusion keys — the Umrah page maps these to icon + label. */
export type UmrahInclusion =
  | "visa"
  | "flights"
  | "transfers"
  | "breakfast"
  | "ziyarah"
  | "guide";

export type UmrahPackage = {
  id: string;
  stars: string;
  nights: string;
  roomType: string;
  month: string;
  makkahHotel: string;
  makkahNights: string;
  madinahHotel: string;
  madinahNights: string;
  price: number;
  priceDisplay: string;
  name?: string;
  tier?: UmrahTier;
  departureDates?: string[];
  roomRates?: UmrahRoomRate[];
  makkahRating?: number;
  makkahDistance?: string;
  madinahRating?: number;
  madinahDistance?: string;
  flight?: UmrahFlight;
  inclusions?: UmrahInclusion[];
  badge?: "Best Seller" | "Limited Seats" | "Early Bird";
  mostPopular?: boolean;
};

export type UmrahCity = {
  id: string; // anchor slug, e.g. "perth"
  city: string; // departure city, e.g. "Perth"
  packages: UmrahPackage[];
};

/** Day-by-day outline derived from the package's own nights and hotels. */
export function buildUmrahItinerary(city: string, pkg: UmrahPackage): string[] {
  const mk = parseInt(pkg.makkahNights, 10) || 0;
  const md = parseInt(pkg.madinahNights, 10) || 0;
  return [
    `Day 1 — Depart ${city}; arrive Jeddah and transfer to Makkah`,
    `Days 1–${mk} — Makkah · ${pkg.makkahHotel} (${pkg.makkahNights}); perform Umrah with group assistance`,
    `Day ${mk + 1} — Coach transfer Makkah → Madinah`,
    `Days ${mk + 1}–${mk + md} — Madinah · ${pkg.madinahHotel} (${pkg.madinahNights}); ziyarah of the holy sites`,
    `Day ${mk + md + 1} — Return flight to ${city}`,
  ];
}

export const UMRAH_EXCLUSIONS: string[] = [
  "Lunches and dinners unless otherwise stated",
  "Travel insurance",
  "Personal expenses and room service",
  "Optional tours outside the published ziyarah program",
  "Excess baggage charges",
];

export const UMRAH_TERMS: string[] = [
  "Prices are per person in AUD, based on the room share shown",
  "Packages are subject to availability and confirmation at the time of booking",
  "A deposit is required to secure seats; the balance is due before departure",
  "Passports must be valid for at least 6 months from the date of travel",
  "Hotel distances are approximate walking distances",
  "The itinerary order may be reversed (Madinah first) depending on flight schedules",
];

/** Lowest `priceDisplay` across the given packages (by numeric price). */
export function lowestPriceDisplay(packages: UmrahPackage[]): string {
  let lowest: UmrahPackage | undefined;
  for (const pkg of packages) {
    if (!lowest || pkg.price < lowest.price) lowest = pkg;
  }
  return lowest?.priceDisplay ?? "";
}
