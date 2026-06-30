import type { RowDataPacket } from "mysql2";

/** DB umrah_packages row → camelCase API shape consumed by the frontend. */
export function mapPackageRow(row: RowDataPacket) {
  return {
    id: row.id as string,
    slug: row.slug as string,
    city: row.city as string,
    stars: row.stars as string,
    nights: row.nights as string,
    roomType: row.room_type as string,
    month: row.month as string | null,
    makkahHotel: row.makkah_hotel as string | null,
    makkahNights: row.makkah_nights as string | null,
    makkahRating: row.makkah_rating == null ? null : Number(row.makkah_rating),
    makkahDistance: row.makkah_distance as string | null,
    madinahHotel: row.madinah_hotel as string | null,
    madinahNights: row.madinah_nights as string | null,
    madinahRating:
      row.madinah_rating == null ? null : Number(row.madinah_rating),
    madinahDistance: row.madinah_distance as string | null,
    price: Number(row.price),
    priceDisplay: row.price_display as string | null,
    name: row.name as string | null,
    tier: row.tier as string | null,
    departureDates: (row.departure_dates as string[] | null) ?? [],
    roomRates: (row.room_rates as unknown[] | null) ?? [],
    flight: (row.flight as Record<string, unknown> | null) ?? null,
    inclusions: (row.inclusions as string[] | null) ?? [],
    badge: row.badge as string | null,
    mostPopular: Boolean(row.most_popular),
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

/** DB destinations row → camelCase API shape consumed by the frontend.
 *  JSON columns come back already parsed by mysql2; coalesce to sensible
 *  empty defaults so the public pages never have to null-check arrays. */
export function mapDestinationRow(row: RowDataPacket) {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    subtitle: (row.subtitle as string | null) ?? "",
    region: (row.region as string | null) ?? "",
    regionLabel: (row.region_label as string | null) ?? "",
    image: (row.image as string | null) ?? "",
    heroImage: (row.hero_image as string | null) ?? "",
    description: (row.description as string | null) ?? "",
    tagline: (row.tagline as string | null) ?? "",
    fromPrice: (row.from_price as string | null) ?? "",
    badge: (row.badge as string | null) ?? undefined,
    rating: (row.rating as string | null) ?? "",
    ratingText: (row.rating_text as string | null) ?? "",
    tags: (row.tags as string[] | null) ?? [],
    styles: (row.styles as string[] | null) ?? [],
    metaItems:
      (row.meta_items as { strong: string; rest: string }[] | null) ?? [],
    highlights:
      (row.highlights as { icon: string; title: string; text: string }[] | null) ??
      [],
    components:
      (row.components as { label: string; details: string }[] | null) ?? [],
    whatsIncluded:
      (row.whats_included as
        | {
            id: string;
            label: string;
            flag: string;
            sections: unknown[];
          }[]
        | null) ?? [],
    pricing:
      (row.pricing as
        | { month: string; amount: string; currency: string; display: string }[]
        | null) ?? [],
    packages: (row.packages as unknown[] | null) ?? [],
    packagesNote: (row.packages_note as string | null) ?? undefined,
    transfersIncluded: (row.transfers_included as string | null) ?? "",
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

/** DB cities row → camelCase API shape. */
export function mapCityRow(row: RowDataPacket) {
  return {
    id: row.id as string,
    name: row.name as string,
    sortOrder: Number(row.sort_order),
    createdAt: row.created_at as string,
  };
}

/** DB reviews row → camelCase API shape. */
export function mapReviewRow(row: RowDataPacket) {
  return {
    id: Number(row.id),
    authorName: row.author_name as string,
    location: row.location as string | null,
    rating: Number(row.rating),
    body: row.body as string,
    source: row.source as string,
    isSample: Boolean(row.is_sample),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at as string,
  };
}

/** DB enquiries row → camelCase API shape. */
export function mapEnquiryRow(row: RowDataPacket) {
  return {
    id: Number(row.id),
    type: row.type as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string | null,
    payload: (row.payload as Record<string, unknown> | null) ?? null,
    sourcePage: row.source_page as string | null,
    status: row.status as string,
    createdAt: row.created_at as string,
  };
}
