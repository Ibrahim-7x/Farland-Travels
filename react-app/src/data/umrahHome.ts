/* ─────────────────────────────────────────────────────────────────
   Static, presentation-only Umrah package samples used by:
     • the home page "Umrah Packages" teaser section, and
     • the Umrah nav mega-dropdown (category → top 3 preview).

   This is intentionally lightweight DUMMY data so both surfaces have
   something to show without hitting the API. The live, bookable
   packages still live in the database and render on /umrah.
   ───────────────────────────────────────────────────────────────── */

export type UmrahHomePackage = {
  id: string;
  name: string;
  regionLabel: string; // e.g. "Makkah · Madinah"
  image: string;
  description: string;
  nights: string; // e.g. "10 nights"
  fromPrice: string; // e.g. "AUD $1,990"
  tags: string[];
  badge?: string;
};

export type UmrahCategory = {
  id: string; // links to /umrah#<id>
  label: string; // heading shown in the dropdown's left rail
  packages: UmrahHomePackage[];
};

// A few reusable images (Kaaba / Makkah / Madinah).
const IMG = {
  kaaba:
    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
  haram:
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80",
  madinah:
    "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800&q=80",
};

/**
 * Category groups for the nav dropdown left rail. The first three packages
 * of each are previewed on the right when the heading is hovered/clicked.
 */
export const UMRAH_CATEGORIES: UmrahCategory[] = [
  {
    id: "umrah-2026",
    label: "Umrah Packages 2026",
    packages: [
      {
        id: "u2026-eco",
        name: "Essential Umrah 2026",
        regionLabel: "Makkah · Madinah",
        image: IMG.kaaba,
        description:
          "10 nights split between Makkah and Madinah in 4-star hotels, with return flights and all transfers included.",
        nights: "10 nights",
        fromPrice: "AUD $1,990",
        tags: ["4-star", "Flights included", "Quad share"],
        badge: "Best Seller",
      },
      {
        id: "u2026-prem",
        name: "Premium Umrah 2026",
        regionLabel: "Makkah · Madinah",
        image: IMG.haram,
        description:
          "12 nights in 5-star hotels steps from the Haram, daily breakfast, guided ziyarah and seamless group transfers.",
        nights: "12 nights",
        fromPrice: "AUD $2,690",
        tags: ["5-star", "Breakfast", "Ziyarah"],
      },
      {
        id: "u2026-vip",
        name: "VIP Umrah 2026",
        regionLabel: "Makkah · Madinah",
        image: IMG.madinah,
        description:
          "14 luxury nights in front-facing rooms overlooking the Holy Mosques, private transfers and a dedicated guide.",
        nights: "14 nights",
        fromPrice: "AUD $3,950",
        tags: ["5-star", "Private transfers", "Guide"],
      },
    ],
  },
  {
    id: "umrah-2027",
    label: "Umrah Packages 2027",
    packages: [
      {
        id: "u2027-eco",
        name: "Essential Umrah 2027",
        regionLabel: "Makkah · Madinah",
        image: IMG.haram,
        description:
          "Early-bird 2027 departures locked in at today's prices — 10 nights with flights and transfers included.",
        nights: "10 nights",
        fromPrice: "AUD $2,090",
        tags: ["4-star", "Early Bird", "Flights included"],
        badge: "Early Bird",
      },
      {
        id: "u2027-prem",
        name: "Premium Umrah 2027",
        regionLabel: "Makkah · Madinah",
        image: IMG.madinah,
        description:
          "12 nights in 5-star hotels with breakfast and guided ziyarah, departing across the 2027 season.",
        nights: "12 nights",
        fromPrice: "AUD $2,790",
        tags: ["5-star", "Breakfast", "Ziyarah"],
      },
      {
        id: "u2027-vip",
        name: "VIP Umrah 2027",
        regionLabel: "Makkah · Madinah",
        image: IMG.kaaba,
        description:
          "14 nights of luxury with Haram-view rooms, private transfers and a personal guide throughout your journey.",
        nights: "14 nights",
        fromPrice: "AUD $4,150",
        tags: ["5-star", "Private transfers", "Guide"],
      },
    ],
  },
  {
    id: "ramadan-umrah",
    label: "Ramadan Umrah",
    packages: [
      {
        id: "ram-last10",
        name: "Last 10 Nights of Ramadan",
        regionLabel: "Makkah · Madinah",
        image: IMG.kaaba,
        description:
          "Spend the blessed final nights in Makkah for Laylatul Qadr — 10 nights close to the Haram with full support.",
        nights: "10 nights",
        fromPrice: "AUD $3,290",
        tags: ["Ramadan", "5-star", "Limited seats"],
        badge: "Limited Seats",
      },
      {
        id: "ram-full",
        name: "Full Ramadan Umrah",
        regionLabel: "Makkah · Madinah",
        image: IMG.haram,
        description:
          "A complete Ramadan experience across Makkah and Madinah with iftar arrangements and guided ziyarah.",
        nights: "21 nights",
        fromPrice: "AUD $5,490",
        tags: ["Ramadan", "Breakfast", "Ziyarah"],
      },
      {
        id: "ram-first10",
        name: "First 10 Nights of Ramadan",
        regionLabel: "Makkah · Madinah",
        image: IMG.madinah,
        description:
          "Begin Ramadan in the holy cities — 10 nights with return flights, transfers and daily breakfast included.",
        nights: "10 nights",
        fromPrice: "AUD $2,990",
        tags: ["Ramadan", "Flights included", "Breakfast"],
      },
    ],
  },
  {
    id: "december-umrah",
    label: "December Umrah",
    packages: [
      {
        id: "dec-school",
        name: "December School-Holiday Umrah",
        regionLabel: "Makkah · Madinah",
        image: IMG.madinah,
        description:
          "Family-friendly December departures during the school break — 10 nights with quad rooms and transfers.",
        nights: "10 nights",
        fromPrice: "AUD $2,190",
        tags: ["Family", "Quad share", "Flights included"],
        badge: "Best Seller",
      },
      {
        id: "dec-prem",
        name: "December Premium Umrah",
        regionLabel: "Makkah · Madinah",
        image: IMG.kaaba,
        description:
          "12 nights in 5-star hotels over the festive break, with daily breakfast and guided ziyarah tours.",
        nights: "12 nights",
        fromPrice: "AUD $2,890",
        tags: ["5-star", "Breakfast", "Ziyarah"],
      },
      {
        id: "dec-newyear",
        name: "New Year Umrah",
        regionLabel: "Makkah · Madinah",
        image: IMG.haram,
        description:
          "See in the new year in the holy cities — 11 nights with return flights, transfers and breakfast.",
        nights: "11 nights",
        fromPrice: "AUD $2,650",
        tags: ["5-star", "Flights included", "Breakfast"],
      },
    ],
  },
  {
    id: "sydney",
    label: "Umrah from Sydney",
    packages: [
      {
        id: "syd-eco",
        name: "Sydney Essential Umrah",
        regionLabel: "Departs Sydney (SYD)",
        image: IMG.kaaba,
        description:
          "Direct-style routing from Sydney — 10 nights in 4-star hotels with flights and all transfers included.",
        nights: "10 nights",
        fromPrice: "AUD $2,150",
        tags: ["Ex-Sydney", "4-star", "Flights included"],
      },
      {
        id: "syd-prem",
        name: "Sydney Premium Umrah",
        regionLabel: "Departs Sydney (SYD)",
        image: IMG.haram,
        description:
          "12 nights in 5-star hotels steps from the Haram, departing Sydney with breakfast and guided ziyarah.",
        nights: "12 nights",
        fromPrice: "AUD $2,850",
        tags: ["Ex-Sydney", "5-star", "Ziyarah"],
      },
      {
        id: "syd-vip",
        name: "Sydney VIP Umrah",
        regionLabel: "Departs Sydney (SYD)",
        image: IMG.madinah,
        description:
          "14 luxury nights from Sydney with Haram-view rooms, private transfers and a dedicated guide.",
        nights: "14 nights",
        fromPrice: "AUD $4,090",
        tags: ["Ex-Sydney", "5-star", "Guide"],
      },
    ],
  },
  {
    id: "melbourne",
    label: "Umrah from Melbourne",
    packages: [
      {
        id: "mel-eco",
        name: "Melbourne Essential Umrah",
        regionLabel: "Departs Melbourne (MEL)",
        image: IMG.haram,
        description:
          "10 nights from Melbourne in 4-star hotels with return flights, transfers and group assistance.",
        nights: "10 nights",
        fromPrice: "AUD $2,190",
        tags: ["Ex-Melbourne", "4-star", "Flights included"],
      },
      {
        id: "mel-prem",
        name: "Melbourne Premium Umrah",
        regionLabel: "Departs Melbourne (MEL)",
        image: IMG.madinah,
        description:
          "12 nights in 5-star hotels close to the Haram, departing Melbourne with breakfast and ziyarah tours.",
        nights: "12 nights",
        fromPrice: "AUD $2,890",
        tags: ["Ex-Melbourne", "5-star", "Ziyarah"],
      },
      {
        id: "mel-vip",
        name: "Melbourne VIP Umrah",
        regionLabel: "Departs Melbourne (MEL)",
        image: IMG.kaaba,
        description:
          "14 nights of luxury from Melbourne with front-facing rooms, private transfers and a personal guide.",
        nights: "14 nights",
        fromPrice: "AUD $4,150",
        tags: ["Ex-Melbourne", "5-star", "Guide"],
      },
    ],
  },
  {
    id: "perth",
    label: "Umrah From Perth",
    packages: [
      {
        id: "per-eco",
        name: "Perth Essential Umrah",
        regionLabel: "Departs Perth (PER)",
        image: IMG.madinah,
        description:
          "Shortest hop to Jeddah — 10 nights from Perth in 4-star hotels with flights and transfers included.",
        nights: "10 nights",
        fromPrice: "AUD $1,990",
        tags: ["Ex-Perth", "4-star", "Flights included"],
        badge: "Best Value",
      },
      {
        id: "per-prem",
        name: "Perth Premium Umrah",
        regionLabel: "Departs Perth (PER)",
        image: IMG.kaaba,
        description:
          "12 nights in 5-star hotels steps from the Haram, departing Perth with breakfast and guided ziyarah.",
        nights: "12 nights",
        fromPrice: "AUD $2,690",
        tags: ["Ex-Perth", "5-star", "Ziyarah"],
      },
      {
        id: "per-vip",
        name: "Perth VIP Umrah",
        regionLabel: "Departs Perth (PER)",
        image: IMG.haram,
        description:
          "14 luxury nights from Perth with Haram-view rooms, private transfers and a dedicated guide throughout.",
        nights: "14 nights",
        fromPrice: "AUD $3,950",
        tags: ["Ex-Perth", "5-star", "Guide"],
      },
    ],
  },
];

/** Flat list of the home page teaser packages (one featured + the rest). */
export const UMRAH_HOME_PACKAGES: UmrahHomePackage[] =
  UMRAH_CATEGORIES[0].packages;
