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

export type Destination = {
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
  pricing?: MonthlyPrice[];
  packages?: SubPackage[];
  packagesNote?: string;
  transfersIncluded: string;
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "singapore-bali",
    name: "Singapore & Bali",
    subtitle: "Twin Capitals & Tropical Beaches",
    region: "Southeast Asia",
    regionLabel: "Singapore · Indonesia",
    image: "/singapour-bali/singapore-bali-exc.jpg",
    heroImage: "/singapour-bali/singapore-bali-exc.jpg",
    description:
      "Begin with four sparkling nights in Singapore — Marina Bay Sands SkyPark and Gardens by the Bay included — then unwind for seven nights in Seminyak, Bali with private snorkelling and Ubud excursions.",
    tagline: "City lights meet island stillness — 11 nights in two of Asia's finest.",
    fromPrice: "AUD $2,088",
    badge: "✦ Editor's pick",
    rating: "★★★★★",
    ratingText: "4.9 · Departing Perth",
    tags: ["City + Beach", "Snorkelling", "11 Nights"],
    styles: ["Beach", "Culture", "Adventure"],
    metaItems: [
      { strong: "11", rest: "nights" },
      { strong: "Perth", rest: "departures" },
      { strong: "Economy", rest: "class flights" },
      { strong: "May / Jun / Sep", rest: "available" },
    ],
    highlights: [
      {
        icon: "🌆",
        title: "Marina Bay SkyPark",
        text: "Step out onto Singapore's iconic 57-storey rooftop with panoramic skyline views.",
      },
      {
        icon: "🌿",
        title: "Gardens by the Bay",
        text: "Explore the futuristic Supertree Grove and Cloud Forest — one of Asia's most photographed gardens.",
      },
      {
        icon: "🤿",
        title: "Blue Lagoon snorkelling",
        text: "Full-day private tour to Bali's clearest reef waters with vibrant coral and marine life.",
      },
      {
        icon: "🛕",
        title: "Ubud cultural highlights",
        text: "Private guide, sacred temples, rice terraces, and the heart of Bali's spiritual scene.",
      },
    ],
    components: [
      {
        label: "Flight (to SIN)",
        details: "Economy Class · Luggage: 1 Piece · From Perth",
      },
      {
        label: "Internal Flights",
        details: "Economy Class · Luggage: 20kg PP · From SIN",
      },
      {
        label: "Singapore Hotel",
        details: "Furama Riverfront — Superior Room · Room Only · 04 Nights",
      },
      {
        label: "Singapore Excursions",
        details: "Marina Bay · Sands SkyPark · Deck Tickets · Gardens by the Bay",
      },
      {
        label: "Bali Hotel (Seminyak)",
        details:
          "FuramaXclusive Ocean Beach — Studio Room · Breakfast · 07 Nights",
      },
      {
        label: "Bali Excursions",
        details:
          "Snorkelling to the Blue Lagoon Full-Day Tour · Ubud Highlights Private Tour (Private guide + transfers included)",
      },
      {
        label: "Transfers",
        details: "All ground transfers included",
      },
    ],
    pricing: [
      { month: "May", amount: "2,088", currency: "AUD", display: "AUD $2,088" },
      { month: "June", amount: "2,183", currency: "AUD", display: "AUD $2,183" },
      {
        month: "September",
        amount: "2,225",
        currency: "AUD",
        display: "AUD $2,225",
      },
    ],
    transfersIncluded: "All ground transfers included",
  },
  {
    slug: "dubai-bali",
    name: "Dubai & Bali",
    subtitle: "Modern Marvel meets Indonesian Paradise",
    region: "Middle East · Southeast Asia",
    regionLabel: "UAE · Indonesia",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=85",
    description:
      "Three opulent nights in Dubai followed by a 12-day private guided journey through Bali and the Gili Islands. Daily meals on tour, classic city contrasts, and private transfers between every highlight.",
    tagline: "Skyscrapers, deserts, and secret beaches — 14 nights of grand contrasts.",
    fromPrice: "AUD $4,074",
    badge: "🔥 Trending",
    rating: "★★★★★",
    ratingText: "4.8 · Departing Perth",
    tags: ["Luxury", "Private Tour", "14 Nights"],
    styles: ["Culture", "Beach", "Adventure"],
    metaItems: [
      { strong: "14", rest: "nights" },
      { strong: "Perth", rest: "departures" },
      { strong: "Private", rest: "Bali tour" },
      { strong: "May / Jun", rest: "available" },
    ],
    highlights: [
      {
        icon: "🏙",
        title: "Dubai cityscape",
        text: "Three nights at Four Points Sheraton Bur Dubai with breakfast and easy access to the souks and Burj Khalifa.",
      },
      {
        icon: "🗺",
        title: "Bali & Gili private tour",
        text: "12 days with a private guide across Bali and the Gili Islands — your own pace, your own schedule.",
      },
      {
        icon: "🍽",
        title: "Daily meals on tour",
        text: "All meals included throughout the Bali leg — focus on the experience, not the logistics.",
      },
      {
        icon: "🏝",
        title: "Gili Islands escape",
        text: "Powder-white sand, turquoise water, and zero traffic — just bicycles and outrigger canoes.",
      },
    ],
    components: [
      {
        label: "Flight",
        details: "Economy Class · Luggage: 1 Piece · From Perth",
      },
      {
        label: "Dubai Hotel",
        details:
          "Four Points Sheraton Bur Dubai — Classic Room · Breakfast · 03 Nights",
      },
      {
        label: "Bali Tour",
        details:
          "Bali & Gili Highlight Private Tour — Standard Room · Daily Meals · 12 Days / 11 Nights",
      },
      { label: "Transfers", details: "Not Included" },
    ],
    pricing: [
      { month: "May", amount: "4,497", currency: "AUD", display: "AUD $4,497" },
      { month: "June", amount: "4,074", currency: "AUD", display: "AUD $4,074" },
    ],
    transfersIncluded: "Transfers not included",
  },
  {
    slug: "bali-long-stay",
    name: "Bali Long Stay",
    subtitle: "20 Nights · Four Distinct Resorts",
    region: "Southeast Asia",
    regionLabel: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=1600&q=85",
    description:
      "Twenty unhurried nights across Ubud, Nusa Dua, Canggu, and Seminyak. A different Bali at every stop — temples and rice fields, calm beaches, surf-town energy, and golden-hour cocktails.",
    tagline: "One island, four moods — settle in and let Bali unfold properly.",
    fromPrice: "AUD $2,181",
    badge: "🌿 Best value",
    rating: "★★★★★",
    ratingText: "5.0 · Departing Perth",
    tags: ["Long stay", "Multi-resort", "20 Nights"],
    styles: ["Wellness", "Beach", "Culture"],
    metaItems: [
      { strong: "20", rest: "nights" },
      { strong: "Perth", rest: "departures" },
      { strong: "4", rest: "resort locations" },
      { strong: "May / Jun / Oct", rest: "available" },
    ],
    highlights: [
      {
        icon: "🛕",
        title: "Ubud · spiritual heart",
        text: "Five nights at Ashoka Tree Resort, walking distance to temples, rice terraces, and the Monkey Forest.",
      },
      {
        icon: "🏖",
        title: "Nusa Dua · serene beaches",
        text: "Five nights at Mercure Bali Nusa Dua — calm waters, manicured grounds, and stress-free family time.",
      },
      {
        icon: "🏄",
        title: "Canggu · surf & cafés",
        text: "Three nights at Hotel Sages in Bali's most stylish surf town — perfect for sunset rides and brunch hopping.",
      },
      {
        icon: "🍹",
        title: "Seminyak · sunset cocktails",
        text: "Seven nights at Paragon Hotel Seminyak — the social end of Bali with rooftops and beach clubs.",
      },
    ],
    components: [
      {
        label: "Flight",
        details: "Economy Class · Luggage: 1 Piece · From Perth",
      },
      {
        label: "Ubud Hotel",
        details: "Ashoka Tree Resort — Superior Room · Breakfast · 05 Nights",
      },
      {
        label: "Nusa Dua Hotel",
        details:
          "Mercure Bali Nusa Dua — Superior Garden View · Breakfast · 05 Nights",
      },
      {
        label: "Canggu Hotel",
        details: "Hotel Sages — Superior Suite · Breakfast · 03 Nights",
      },
      {
        label: "Seminyak Hotel",
        details:
          "Paragon Hotel Seminyak — Deluxe Balcony Room · Breakfast · 07 Nights",
      },
      {
        label: "Transfers",
        details: "All ground return transfers included",
      },
    ],
    pricing: [
      { month: "May", amount: "2,181", currency: "AUD", display: "AUD $2,181" },
      { month: "June", amount: "2,592", currency: "AUD", display: "AUD $2,592" },
      {
        month: "October",
        amount: "2,221",
        currency: "AUD",
        display: "AUD $2,221",
      },
    ],
    transfersIncluded: "All ground return transfers included",
  },
  /* Temporarily hidden — Makkah & Madinah package
  {
    slug: "makkah-madinah",
    name: "Makkah & Madinah",
    subtitle: "Sacred Journey · September Departures",
    region: "Middle East",
    regionLabel: "Saudi Arabia",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1600&q=85",
    description:
      "Three carefully curated Umrah packages with five-star and 5/4-star hotels close to the Haram and Masjid al-Nabawi. Choose from 7, 10, or 12 nights — all departing September.",
    tagline: "Stay steps from the Haram — choose 7, 10, or 12 nights.",
    fromPrice: "£1,475",
    badge: "✦ September departures",
    rating: "★★★★★",
    ratingText: "5.0 · Departing UK",
    tags: ["Spiritual", "Family", "September"],
    styles: ["Culture", "Spiritual", "Family"],
    metaItems: [
      { strong: "7–12", rest: "nights" },
      { strong: "September", rest: "departures" },
      { strong: "5★ / 4★", rest: "hotels" },
      { strong: "3", rest: "package options" },
    ],
    highlights: [
      {
        icon: "🕋",
        title: "Steps from the Haram",
        text: "Anjum and Swissotel Al Maqam both offer direct walking access to the Holy Mosque.",
      },
      {
        icon: "🕌",
        title: "Close to Masjid al-Nabawi",
        text: "Emaar Royal, Saja Al Madinah, and Taiba Madinah are all in walking distance of the Prophet's Mosque.",
      },
      {
        icon: "🌙",
        title: "Three package lengths",
        text: "Choose 7, 10, or 12 nights — split between Makkah and Madinah to suit your travel plans.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Quad rooms · family-friendly",
        text: "All published prices are based on Quad occupancy — ideal for families travelling together.",
      },
    ],
    packages: [
      {
        id: "p1",
        name: "Package 1",
        stars: "5 Star",
        duration: "7 Nights (4 Makkah + 3 Madinah)",
        hotels: "Anjum Hotel 5★ (Makkah) + Emaar Royal 5★ (Madinah)",
        roomType: "Quad",
        priceDisplay: "£1,475",
      },
      {
        id: "p2",
        name: "Package 2",
        stars: "5/4 Star",
        duration: "10 Nights (6 Makkah + 4 Madinah)",
        hotels:
          "Swissotel Al Maqam 5★ (Makkah) + Saja Al Madinah 4★ (Madinah)",
        roomType: "Quad",
        priceDisplay: "£1,524",
      },
      {
        id: "p3",
        name: "Package 3",
        stars: "5/4 Star",
        duration: "12 Nights (6 Makkah + 6 Madinah)",
        hotels:
          "Swissotel Al Maqam 5★ (Makkah) + Taiba Madinah 5★ (Madinah)",
        roomType: "Quad",
        priceDisplay: "£1,814",
      },
    ],
    packagesNote: "All three packages depart in September.",
    transfersIncluded: "Group transfers between Makkah and Madinah included",
  },
  */
];

export function getDestination(slug?: string): Destination | undefined {
  if (!slug) return undefined;
  return DESTINATIONS.find((d) => d.slug === slug);
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

export function getAllMonths(): string[] {
  const set = new Set<string>();
  for (const d of DESTINATIONS) {
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
   Clicking a city does a fuzzy match against DESTINATIONS to surface
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
    ...(d.highlights ?? []).map((h) => `${h.title} ${h.text}`),
  ];
  return parts.join(" • ").toLowerCase();
}

export function findDealsForCity(city: City): Destination[] {
  const terms = [city.name.toLowerCase(), ...(city.searchTerms ?? []).map((t) => t.toLowerCase())];
  return DESTINATIONS.filter((d) => {
    const hay = destinationSearchableText(d);
    return terms.some((t) => hay.includes(t));
  });
}

export function findDealsForCityName(cityName: string): Destination[] {
  const found = CITIES.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );
  if (found) return findDealsForCity(found);
  const needle = cityName.toLowerCase();
  return DESTINATIONS.filter((d) =>
    destinationSearchableText(d).includes(needle)
  );
}
