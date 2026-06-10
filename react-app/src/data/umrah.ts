/* ─────────────────────────────────────────────────────────────────
   UMRAH — packages grouped by departure city (Perth, Melbourne, Sydney)
   Mirrors the typed-data-module pattern used by destinations.ts
   (see SubPackage / City). Consumed by the Nav "Umrah" dropdown and
   the /umrah listing page.

   ⚠️ DRAFT PLACEHOLDER CONTENT — REVIEW BEFORE PUBLISHING ⚠️
   The card-display fields below (name, tier, departureDates, roomRates,
   hotel ratings/distances, flight, inclusions, badge, mostPopular) and
   the AUD price labels were drafted as realistic placeholders and have
   NOT been verified against real fares, hotel facts, or flight schedules.
   Every value must be checked and corrected before going live.
   ───────────────────────────────────────────────────────────────── */

export type UmrahTier = "Economy" | "Premium" | "VIP";

export type UmrahRoomRate = {
  room: string; // "Quad" | "Triple" | "Double"
  priceDisplay: string; // per person, e.g. "A$1,875"
};

export type UmrahFlight = {
  airline: string; // e.g. "Qatar Airways"
  routing: string; // e.g. "1 stop via Doha"
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
  stars: string; // e.g. "5 Star", "4 & 5 Star", "5/4 Star"
  nights: string; // total, e.g. "10 nights"
  roomType: string; // base room share, e.g. "Quad"
  month: string; // e.g. "September"
  makkahHotel: string;
  makkahNights: string; // e.g. "6 nights"
  madinahHotel: string;
  madinahNights: string; // e.g. "4 nights"
  price: number; // numeric, for "from" + sorting
  priceDisplay: string; // e.g. "A$1,675" (AUD)
  /* ── Card-display fields (all optional — the page hides whatever is
     absent rather than rendering blanks). All DRAFT, see banner above. */
  name?: string; // display name, e.g. "10-Night Signature Umrah"
  tier?: UmrahTier;
  departureDates?: string[]; // e.g. ["5 Sep 2026", "19 Sep 2026"]
  roomRates?: UmrahRoomRate[]; // per-person rates by room share
  makkahRating?: number; // hotel stars, e.g. 5
  makkahDistance?: string; // e.g. "≈300 m from the Haram"
  madinahRating?: number;
  madinahDistance?: string; // e.g. "≈250 m from Masjid an-Nabawi"
  flight?: UmrahFlight;
  inclusions?: UmrahInclusion[];
  badge?: "Best Seller" | "Limited Seats" | "Early Bird";
  mostPopular?: boolean; // at most one per city — gets the highlighted card
};

export type UmrahCity = {
  id: string; // anchor slug, e.g. "perth"
  city: string; // departure city, e.g. "Perth"
  packages: UmrahPackage[];
};

export const UMRAH_CITIES: UmrahCity[] = [
  {
    id: "perth",
    city: "Perth",
    packages: [
      {
        id: "perth-1",
        stars: "5 Star",
        nights: "10 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Jabal Omar Marriott Hotel, Makkah",
        makkahNights: "6 nights",
        madinahHotel: "Pullman Zamzam Madina",
        madinahNights: "4 nights",
        price: 1675,
        priceDisplay: "A$1,675",
        name: "10-Night Signature Umrah",
        tier: "VIP",
        departureDates: ["4 Sep 2026", "18 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,675" },
          { room: "Triple", priceDisplay: "A$1,875" },
          { room: "Double", priceDisplay: "A$2,125" },
        ],
        makkahRating: 5,
        makkahDistance: "≈300 m from the Haram",
        madinahRating: 5,
        madinahDistance: "≈50 m from Masjid an-Nabawi",
        flight: { airline: "Qatar Airways", routing: "1 stop via Doha" },
        inclusions: [
          "visa",
          "flights",
          "transfers",
          "breakfast",
          "ziyarah",
          "guide",
        ],
      },
      {
        id: "perth-2",
        stars: "4 & 5 Star",
        nights: "7 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Makarem Ajyad Makkah Hotel",
        makkahNights: "4 nights",
        madinahHotel: "Saja Al Madinah Hotel 4*",
        madinahNights: "3 nights",
        price: 855,
        priceDisplay: "A$855",
        name: "7-Night Essential Umrah",
        tier: "Economy",
        departureDates: ["5 Sep 2026", "19 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$855" },
          { room: "Triple", priceDisplay: "A$960" },
          { room: "Double", priceDisplay: "A$1,085" },
        ],
        makkahRating: 4,
        makkahDistance: "≈150 m from the Haram",
        madinahRating: 4,
        madinahDistance: "≈250 m from Masjid an-Nabawi",
        flight: { airline: "Qatar Airways", routing: "1 stop via Doha" },
        inclusions: ["visa", "flights", "transfers", "breakfast"],
        badge: "Best Seller",
      },
      {
        id: "perth-3",
        stars: "4 Star",
        nights: "12 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Swissotel Al Maqam Makkah",
        makkahNights: "7 nights",
        madinahHotel: "Emaar Royal Hotel Al Madina",
        madinahNights: "5 nights",
        price: 1203,
        priceDisplay: "A$1,203",
        name: "12-Night Essential Umrah",
        tier: "Economy",
        departureDates: ["2 Sep 2026", "16 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,203" },
          { room: "Triple", priceDisplay: "A$1,345" },
          { room: "Double", priceDisplay: "A$1,530" },
        ],
        makkahRating: 5,
        makkahDistance: "≈100 m from the Haram",
        madinahRating: 5,
        madinahDistance: "≈200 m from Masjid an-Nabawi",
        flight: { airline: "Qatar Airways", routing: "1 stop via Doha" },
        inclusions: ["visa", "flights", "transfers", "breakfast"],
      },
      {
        id: "perth-4",
        stars: "5 Star",
        nights: "7 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Anjum Hotel 5*",
        makkahNights: "4 nights",
        madinahHotel: "Emaar Royal 5*",
        madinahNights: "3 nights",
        price: 1475,
        priceDisplay: "A$1,475",
        name: "7-Night Signature Umrah",
        tier: "VIP",
        departureDates: ["5 Sep 2026", "19 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,475" },
          { room: "Triple", priceDisplay: "A$1,650" },
          { room: "Double", priceDisplay: "A$1,875" },
        ],
        makkahRating: 5,
        makkahDistance: "≈450 m from the Haram",
        madinahRating: 5,
        madinahDistance: "≈200 m from Masjid an-Nabawi",
        flight: { airline: "Qatar Airways", routing: "1 stop via Doha" },
        inclusions: [
          "visa",
          "flights",
          "transfers",
          "breakfast",
          "ziyarah",
          "guide",
        ],
        badge: "Limited Seats",
      },
      {
        id: "perth-5",
        stars: "5/4 Star",
        nights: "10 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Swissotel al Maqam 5*",
        makkahNights: "6 nights",
        madinahHotel: "Saja Al Madinah 4*",
        madinahNights: "4 nights",
        price: 1524,
        priceDisplay: "A$1,524",
        name: "10-Night Select Umrah",
        tier: "Premium",
        departureDates: ["4 Sep 2026", "18 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,524" },
          { room: "Triple", priceDisplay: "A$1,705" },
          { room: "Double", priceDisplay: "A$1,935" },
        ],
        makkahRating: 5,
        makkahDistance: "≈100 m from the Haram",
        madinahRating: 4,
        madinahDistance: "≈250 m from Masjid an-Nabawi",
        flight: { airline: "Qatar Airways", routing: "1 stop via Doha" },
        inclusions: ["visa", "flights", "transfers", "breakfast", "ziyarah"],
        mostPopular: true,
      },
      {
        id: "perth-6",
        stars: "5/4 Star",
        nights: "12 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Swissotel al Maqam 5*",
        makkahNights: "6 nights",
        madinahHotel: "Taiba Madinah 5*",
        madinahNights: "6 nights",
        price: 1814,
        priceDisplay: "A$1,814",
        name: "12-Night Select Umrah",
        tier: "Premium",
        departureDates: ["2 Sep 2026", "16 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,814" },
          { room: "Triple", priceDisplay: "A$2,030" },
          { room: "Double", priceDisplay: "A$2,305" },
        ],
        makkahRating: 5,
        makkahDistance: "≈100 m from the Haram",
        madinahRating: 5,
        madinahDistance: "≈100 m from Masjid an-Nabawi",
        flight: { airline: "Qatar Airways", routing: "1 stop via Doha" },
        inclusions: ["visa", "flights", "transfers", "breakfast", "ziyarah"],
        badge: "Early Bird",
      },
    ],
  },
  {
    id: "melbourne",
    city: "Melbourne",
    packages: [
      {
        id: "melbourne-1",
        stars: "5 Star",
        nights: "7 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Anjum Hotel 5*",
        makkahNights: "4 nights",
        madinahHotel: "Emaar Royal 5*",
        madinahNights: "3 nights",
        price: 1509,
        priceDisplay: "A$1,509",
        name: "7-Night Signature Umrah",
        tier: "VIP",
        departureDates: ["5 Sep 2026", "19 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,509" },
          { room: "Triple", priceDisplay: "A$1,690" },
          { room: "Double", priceDisplay: "A$1,915" },
        ],
        makkahRating: 5,
        makkahDistance: "≈450 m from the Haram",
        madinahRating: 5,
        madinahDistance: "≈200 m from Masjid an-Nabawi",
        flight: { airline: "Emirates", routing: "1 stop via Dubai" },
        inclusions: [
          "visa",
          "flights",
          "transfers",
          "breakfast",
          "ziyarah",
          "guide",
        ],
        badge: "Limited Seats",
      },
      {
        id: "melbourne-2",
        stars: "5/4 Star",
        nights: "10 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Jabal Omar Marriott 5*",
        makkahNights: "6 nights",
        madinahHotel: "Saja al Madinah 4*",
        madinahNights: "4 nights",
        price: 1631,
        priceDisplay: "A$1,631",
        name: "10-Night Select Umrah",
        tier: "Premium",
        departureDates: ["4 Sep 2026", "18 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,631" },
          { room: "Triple", priceDisplay: "A$1,825" },
          { room: "Double", priceDisplay: "A$2,070" },
        ],
        makkahRating: 5,
        makkahDistance: "≈300 m from the Haram",
        madinahRating: 4,
        madinahDistance: "≈250 m from Masjid an-Nabawi",
        flight: { airline: "Emirates", routing: "1 stop via Dubai" },
        inclusions: ["visa", "flights", "transfers", "breakfast", "ziyarah"],
        mostPopular: true,
      },
      {
        id: "melbourne-3",
        stars: "5/4 Star",
        nights: "12 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Anjum Hotel 5*",
        makkahNights: "6 nights",
        madinahHotel: "Saja al Madinah 4*",
        madinahNights: "6 nights",
        price: 1719,
        priceDisplay: "A$1,719",
        name: "12-Night Select Umrah",
        tier: "Premium",
        departureDates: ["2 Sep 2026", "16 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,719" },
          { room: "Triple", priceDisplay: "A$1,925" },
          { room: "Double", priceDisplay: "A$2,185" },
        ],
        makkahRating: 5,
        makkahDistance: "≈450 m from the Haram",
        madinahRating: 4,
        madinahDistance: "≈250 m from Masjid an-Nabawi",
        flight: { airline: "Emirates", routing: "1 stop via Dubai" },
        inclusions: ["visa", "flights", "transfers", "breakfast", "ziyarah"],
        badge: "Early Bird",
      },
    ],
  },
  {
    id: "sydney",
    city: "Sydney",
    packages: [
      {
        id: "sydney-1",
        stars: "5 Star",
        nights: "7 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Anjum Hotel 5*",
        makkahNights: "4 nights",
        madinahHotel: "Pullman ZamZam Medina 5*",
        madinahNights: "3 nights",
        price: 1492,
        priceDisplay: "A$1,492",
        name: "7-Night Signature Umrah",
        tier: "VIP",
        departureDates: ["5 Sep 2026", "19 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,492" },
          { room: "Triple", priceDisplay: "A$1,670" },
          { room: "Double", priceDisplay: "A$1,895" },
        ],
        makkahRating: 5,
        makkahDistance: "≈450 m from the Haram",
        madinahRating: 5,
        madinahDistance: "≈50 m from Masjid an-Nabawi",
        flight: { airline: "Etihad Airways", routing: "1 stop via Abu Dhabi" },
        inclusions: [
          "visa",
          "flights",
          "transfers",
          "breakfast",
          "ziyarah",
          "guide",
        ],
        badge: "Limited Seats",
      },
      {
        id: "sydney-2",
        stars: "5/4 Star",
        nights: "10 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Jabal Omar Marriott 5*",
        makkahNights: "6 nights",
        madinahHotel: "Saja Al Madinah 4*",
        madinahNights: "4 nights",
        price: 1615,
        priceDisplay: "A$1,615",
        name: "10-Night Select Umrah",
        tier: "Premium",
        departureDates: ["4 Sep 2026", "18 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,615" },
          { room: "Triple", priceDisplay: "A$1,810" },
          { room: "Double", priceDisplay: "A$2,050" },
        ],
        makkahRating: 5,
        makkahDistance: "≈300 m from the Haram",
        madinahRating: 4,
        madinahDistance: "≈250 m from Masjid an-Nabawi",
        flight: { airline: "Etihad Airways", routing: "1 stop via Abu Dhabi" },
        inclusions: ["visa", "flights", "transfers", "breakfast", "ziyarah"],
        mostPopular: true,
      },
      {
        id: "sydney-3",
        stars: "5/4 Star",
        nights: "12 nights",
        roomType: "Quad",
        month: "September",
        makkahHotel: "Swissotel al Maqam 5*",
        makkahNights: "6 nights",
        madinahHotel: "Saja Al Madinah 4*",
        madinahNights: "6 nights",
        price: 1778,
        priceDisplay: "A$1,778",
        name: "12-Night Select Umrah",
        tier: "Premium",
        departureDates: ["2 Sep 2026", "16 Sep 2026"],
        roomRates: [
          { room: "Quad", priceDisplay: "A$1,778" },
          { room: "Triple", priceDisplay: "A$1,990" },
          { room: "Double", priceDisplay: "A$2,260" },
        ],
        makkahRating: 5,
        makkahDistance: "≈100 m from the Haram",
        madinahRating: 4,
        madinahDistance: "≈250 m from Masjid an-Nabawi",
        flight: { airline: "Etihad Airways", routing: "1 stop via Abu Dhabi" },
        inclusions: ["visa", "flights", "transfers", "breakfast", "ziyarah"],
        badge: "Early Bird",
      },
    ],
  },
];

/* ── Shared "View Details" content (DRAFT — review before publishing) ── */

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

/** Compact star label for tight spaces (e.g. nav pills): "5 Star" → "5★". */
export function umrahStarsShort(stars: string): string {
  return stars.replace(/\s*Stars?$/i, "★");
}

/** Lowest published price across all Umrah packages, formatted as "A$855". */
export function getUmrahFromPrice(): string {
  const all = UMRAH_CITIES.flatMap((c) => c.packages);
  const min = all.reduce((lo, p) => (p.price < lo.price ? p : lo), all[0]);
  return min.priceDisplay;
}

/** Total number of Umrah packages across every departure city. */
export function getUmrahPackageCount(): number {
  return UMRAH_CITIES.reduce((sum, c) => sum + c.packages.length, 0);
}
