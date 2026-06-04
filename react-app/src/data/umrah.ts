/* ─────────────────────────────────────────────────────────────────
   UMRAH — packages grouped by departure city (Perth, Melbourne, Sydney)
   Mirrors the typed-data-module pattern used by destinations.ts
   (see SubPackage / City). Consumed by the Nav "Umrah" dropdown and
   the /umrah listing page.
   ───────────────────────────────────────────────────────────────── */

export type UmrahPackage = {
  id: string;
  stars: string; // e.g. "5 Star", "4 & 5 Star", "5/4 Star"
  nights: string; // total, e.g. "10 nights"
  roomType: string; // e.g. "Quad"
  month: string; // e.g. "September"
  makkahHotel: string;
  makkahNights: string; // e.g. "6 nights"
  madinahHotel: string;
  madinahNights: string; // e.g. "4 nights"
  price: number; // numeric, for "from" + sorting
  priceDisplay: string; // e.g. "£1,675"
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
        priceDisplay: "£1,675",
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
        priceDisplay: "£855",
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
        priceDisplay: "£1,203",
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
        priceDisplay: "£1,475",
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
        priceDisplay: "£1,524",
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
        priceDisplay: "£1,814",
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
        priceDisplay: "£1,509",
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
        priceDisplay: "£1,631",
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
        priceDisplay: "£1,719",
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
        priceDisplay: "£1,492",
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
        priceDisplay: "£1,615",
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
        priceDisplay: "£1,778",
      },
    ],
  },
];

/** Compact star label for tight spaces (e.g. nav pills): "5 Star" → "5★". */
export function umrahStarsShort(stars: string): string {
  return stars.replace(/\s*Stars?$/i, "★");
}

/** Lowest published price across all Umrah packages, formatted as "£855". */
export function getUmrahFromPrice(): string {
  const all = UMRAH_CITIES.flatMap((c) => c.packages);
  const min = all.reduce((lo, p) => (p.price < lo.price ? p : lo), all[0]);
  return min.priceDisplay;
}

/** Total number of Umrah packages across every departure city. */
export function getUmrahPackageCount(): number {
  return UMRAH_CITIES.reduce((sum, c) => sum + c.packages.length, 0);
}
