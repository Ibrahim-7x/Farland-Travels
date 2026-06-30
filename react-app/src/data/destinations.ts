// Holiday-deal types + helpers. The deal data itself is no longer hard-coded
// here — it's managed in the admin panel and served from /api/destinations
// (see contexts/DestinationsProvider). These helpers operate on whatever live
// list the caller passes in (from useDestinations()).
//
// CITIES (the continent → country → city browse list at the bottom) is still
// static for now and slated to move into the admin panel in a later phase.

export type PackageComponent = {
  label: string;
  details: string;
};

export type MonthlyPrice = {
  month: string;
  amount: string;
  currency: string;
  display: string;
};

export type SubPackage = {
  id: string;
  name: string;
  stars: string;
  duration: string;
  hotels: string;
  roomType: string;
  priceDisplay: string;
};

// ── "What's Included" — admin-editable, rendered as the tabbed card on the
// deal page. A deal has one or more tabs (legs/cities); each tab has sections
// (Flights, Hotel, Excursions…); each section has bullet lines and photos.
export type WhatsIncludedImage = { src: string; alt: string };
export type WhatsIncludedItem = {
  label?: string;
  primary?: string;
  pills?: string[];
};
export type WhatsIncludedSection = {
  icon: string;
  title: string;
  items: WhatsIncludedItem[];
  images?: WhatsIncludedImage[];
};
export type WhatsIncludedTab = {
  id: string;
  label: string;
  flag: string;
  sections: WhatsIncludedSection[];
};

export type Destination = {
  id?: string;
  slug: string;
  name: string;
  subtitle: string;
  region: string;
  regionLabel: string;
  image: string;
  heroImage: string;
  description: string;
  tagline: string;
  fromPrice: string;
  badge?: string;
  rating: string;
  ratingText: string;
  tags: string[];
  styles: string[];
  metaItems: { strong: string; rest: string }[];
  highlights?: { icon: string; title: string; text: string }[];
  components?: PackageComponent[];
  whatsIncluded?: WhatsIncludedTab[];
  pricing?: MonthlyPrice[];
  packages?: SubPackage[];
  packagesNote?: string;
  transfersIncluded: string;
};

export function getDestination(
  destinations: Destination[],
  slug?: string,
): Destination | undefined {
  if (!slug) return undefined;
  return destinations.find((d) => d.slug === slug);
}

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function getDestinationMonths(dest: Destination): string[] {
  if (dest.pricing && dest.pricing.length > 0) {
    return dest.pricing.map((p) => p.month);
  }
  return ["September"];
}

export function getAllMonths(destinations: Destination[]): string[] {
  const set = new Set<string>();
  for (const d of destinations) {
    for (const m of getDestinationMonths(d)) set.add(m);
  }
  return Array.from(set).sort(
    (a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)
  );
}

export function getPriceForMonth(
  dest: Destination,
  month: string
): MonthlyPrice | undefined {
  if (!dest.pricing) return undefined;
  return dest.pricing.find((p) => p.month === month);
}

/* ─────────────────────────────────────────────────────────────────
   CITIES — Continent → Country → City hierarchy
   Used by the Destinations page to render a hierarchical browse.
   Clicking a city does a fuzzy match against the live deals to surface
   any deal that mentions the city anywhere in its content.
   ───────────────────────────────────────────────────────────────── */

export type City = {
  name: string;
  country: string;
  continent: string;
  image: string;
  tagline: string;
  searchTerms?: string[];
};

export const CONTINENT_ORDER = [
  "Asia",
  "Middle East",
  "Europe",
  "Americas",
  "Africa",
  "Oceania",
] as const;

export const CITIES: City[] = [
  // ── ASIA ─────────────────────────────────────────────
  {
    name: "Singapore",
    country: "Singapore",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
    tagline: "Marina Bay skyline, hawker food, futuristic gardens.",
  },
  {
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80",
    tagline: "Temples, surf breaks, rice terraces — island of the gods.",
    searchTerms: ["bali"],
  },
  {
    name: "Ubud",
    country: "Indonesia",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    tagline: "Spiritual heart of Bali — yoga, rice paddies, sacred temples.",
  },
  {
    name: "Seminyak",
    country: "Indonesia",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80",
    tagline: "Beach clubs, sunset cocktails, stylish boutique stays.",
  },
  {
    name: "Nusa Dua",
    country: "Indonesia",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1571317084911-8899d61cc464?w=800&q=80",
    tagline: "Manicured resorts, calm waters, family-friendly serenity.",
  },
  {
    name: "Canggu",
    country: "Indonesia",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&q=80",
    tagline: "Surf town energy — cafés, scooters, sunset rides.",
  },
  {
    name: "Gili Islands",
    country: "Indonesia",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    tagline: "Powder-white sand, turquoise water, zero traffic.",
    searchTerms: ["gili"],
  },
  {
    name: "Bangkok",
    country: "Thailand",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    tagline: "Street food, golden temples, river-side energy.",
  },
  {
    name: "Phuket",
    country: "Thailand",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80",
    tagline: "Tropical beaches, longtail boats, limestone cliffs.",
  },
  {
    name: "Tokyo",
    country: "Japan",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    tagline: "Neon avenues, hidden alleys, the future and tradition.",
  },
  {
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    tagline: "Bamboo groves, geisha districts, thousand-year temples.",
  },
  {
    name: "Malé",
    country: "Maldives",
    continent: "Asia",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    tagline: "Overwater villas, coral atolls, glass-clear lagoons.",
    searchTerms: ["maldives"],
  },

  // ── MIDDLE EAST ──────────────────────────────────────
  {
    name: "Dubai",
    country: "UAE",
    continent: "Middle East",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    tagline: "Skyscrapers, desert dunes, gold souks and modern marvels.",
  },
  {
    name: "Abu Dhabi",
    country: "UAE",
    continent: "Middle East",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
    tagline: "Grand mosques, Corniche promenades, refined luxury.",
  },
  {
    name: "Makkah",
    country: "Saudi Arabia",
    continent: "Middle East",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
    tagline: "The holiest city — steps from the Haram.",
  },
  {
    name: "Madinah",
    country: "Saudi Arabia",
    continent: "Middle East",
    image:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
    tagline: "Masjid al-Nabawi, palm groves, tranquil reverence.",
  },
  {
    name: "Doha",
    country: "Qatar",
    continent: "Middle East",
    image:
      "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80",
    tagline: "Souq Waqif, contemporary skyline, Arabian Gulf views.",
  },

  // ── EUROPE ───────────────────────────────────────────
  {
    name: "Paris",
    country: "France",
    continent: "Europe",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    tagline: "Cafés, Haussmann boulevards, Seine-side strolls.",
  },
  {
    name: "Rome",
    country: "Italy",
    continent: "Europe",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    tagline: "Ancient ruins, fountain piazzas, espresso and gelato.",
  },
  {
    name: "Venice",
    country: "Italy",
    continent: "Europe",
    image:
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=80",
    tagline: "Canals, gondolas, palazzos at golden hour.",
  },
  {
    name: "London",
    country: "United Kingdom",
    continent: "Europe",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    tagline: "Royal parks, black cabs, world-class theatre and museums.",
  },
  {
    name: "Santorini",
    country: "Greece",
    continent: "Europe",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    tagline: "Whitewashed villages perched above the caldera.",
  },

  // ── AMERICAS ─────────────────────────────────────────
  {
    name: "New York",
    country: "United States",
    continent: "Americas",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    tagline: "Yellow cabs, Broadway lights, Brooklyn brownstones.",
  },
  {
    name: "Los Angeles",
    country: "United States",
    continent: "Americas",
    image:
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&q=80",
    tagline: "Pacific sunsets, Hollywood Hills, palm-lined boulevards.",
  },
  {
    name: "Rio de Janeiro",
    country: "Brazil",
    continent: "Americas",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
    tagline: "Beaches, Sugarloaf, samba and Carnival rhythm.",
  },

  // ── AFRICA ───────────────────────────────────────────
  {
    name: "Cairo",
    country: "Egypt",
    continent: "Africa",
    image:
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=80",
    tagline: "Pyramids of Giza, bustling bazaars, the eternal Nile.",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    tagline: "Table Mountain, vineyard valleys, two-ocean coast.",
  },
  {
    name: "Zanzibar",
    country: "Tanzania",
    continent: "Africa",
    image:
      "https://images.unsplash.com/photo-1505881502353-a1986add3762?w=800&q=80",
    tagline: "Spice markets, Stone Town, turquoise Indian Ocean.",
  },

  // ── OCEANIA ──────────────────────────────────────────
  {
    name: "Sydney",
    country: "Australia",
    continent: "Oceania",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
    tagline: "Opera House, Bondi Beach, harbour-side bridge climbs.",
  },
  {
    name: "Melbourne",
    country: "Australia",
    continent: "Oceania",
    image:
      "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800&q=80",
    tagline: "Laneway coffee, street art, world-class dining.",
  },
  {
    name: "Auckland",
    country: "New Zealand",
    continent: "Oceania",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
    tagline: "Twin harbours, vineyard islands, volcanic landscapes.",
  },
  {
    name: "Nadi",
    country: "Fiji",
    continent: "Oceania",
    image:
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
    tagline: "Coral lagoons, palm-fringed islands, warm welcome.",
    searchTerms: ["fiji"],
  },
];

export type CityGroupedByCountry = { country: string; cities: City[] };
export type ContinentGroup = {
  continent: string;
  countries: CityGroupedByCountry[];
  totalCities: number;
};

export function getCitiesGrouped(): ContinentGroup[] {
  const byContinent = new Map<string, Map<string, City[]>>();
  for (const c of CITIES) {
    if (!byContinent.has(c.continent)) byContinent.set(c.continent, new Map());
    const countries = byContinent.get(c.continent)!;
    if (!countries.has(c.country)) countries.set(c.country, []);
    countries.get(c.country)!.push(c);
  }
  return CONTINENT_ORDER.filter((cont) => byContinent.has(cont)).map((cont) => {
    const countries = Array.from(byContinent.get(cont)!.entries())
      .map(([country, cities]) => ({ country, cities }))
      .sort((a, b) => a.country.localeCompare(b.country));
    const totalCities = countries.reduce((s, c) => s + c.cities.length, 0);
    return { continent: cont, countries, totalCities };
  });
}

function destinationSearchableText(d: Destination): string {
  const parts = [
    d.name,
    d.subtitle,
    d.region,
    d.regionLabel,
    d.description,
    d.tagline,
    ...(d.tags ?? []),
    ...(d.styles ?? []),
    ...(d.components ?? []).map((c) => `${c.label} ${c.details}`),
    ...(d.whatsIncluded ?? []).flatMap((t) => [
      t.label,
      ...t.sections.flatMap((s) => [
        s.title,
        ...s.items.flatMap((it) => [
          it.label ?? "",
          it.primary ?? "",
          ...(it.pills ?? []),
        ]),
      ]),
    ]),
    ...(d.highlights ?? []).map((h) => `${h.title} ${h.text}`),
  ];
  return parts.join(" • ").toLowerCase();
}

export function findDealsForCity(
  destinations: Destination[],
  city: City,
): Destination[] {
  const terms = [city.name.toLowerCase(), ...(city.searchTerms ?? []).map((t) => t.toLowerCase())];
  return destinations.filter((d) => {
    const hay = destinationSearchableText(d);
    return terms.some((t) => hay.includes(t));
  });
}

export function findDealsForCityName(
  destinations: Destination[],
  cityName: string,
): Destination[] {
  const found = CITIES.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );
  if (found) return findDealsForCity(destinations, found);
  const needle = cityName.toLowerCase();
  return destinations.filter((d) =>
    destinationSearchableText(d).includes(needle)
  );
}
