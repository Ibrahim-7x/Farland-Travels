import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2/promise";
import { pool } from "../db/pool";
import { env } from "../config/env";
import { UMRAH_CITIES, type UmrahPackage } from "./umrah-data";

/** url-safe slug, capped at the column width (100). */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/** JSON column helper: stringify or null. */
const j = (value: unknown): string | null =>
  value == null ? null : JSON.stringify(value);

async function seedAdmin(): Promise<void> {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.warn(
      "[seed] ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin user.",
    );
    return;
  }
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM admin_users WHERE email = ?",
    [env.ADMIN_EMAIL],
  );
  if (rows.length > 0) {
    console.log(`[seed] admin user ${env.ADMIN_EMAIL} already exists — skip.`);
    return;
  }
  const hash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await pool.query(
    "INSERT INTO admin_users (email, password_hash) VALUES (?, ?)",
    [env.ADMIN_EMAIL, hash],
  );
  console.log(`[seed] created admin user ${env.ADMIN_EMAIL}.`);
}

async function seedUmrahPackages(): Promise<void> {
  const [countRows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS n FROM umrah_packages",
  );
  if (Number(countRows[0]?.n ?? 0) > 0) {
    console.log("[seed] umrah_packages already populated — skip.");
    return;
  }

  const usedSlugs = new Set<string>();
  let inserted = 0;

  for (const city of UMRAH_CITIES) {
    let sortOrder = 0;
    for (const pkg of city.packages) {
      let slug = slugify(`${city.city} ${pkg.name ?? pkg.id}`);
      if (!slug || usedSlugs.has(slug)) slug = slugify(`${city.city} ${pkg.id}`);
      while (usedSlugs.has(slug)) slug = `${slug}-x`;
      usedSlugs.add(slug);

      await pool.query(
        `INSERT INTO umrah_packages (
           id, slug, city, stars, nights, room_type, month,
           makkah_hotel, makkah_nights, makkah_rating, makkah_distance,
           madinah_hotel, madinah_nights, madinah_rating, madinah_distance,
           price, price_display, name, tier,
           departure_dates, room_rates, flight, inclusions,
           badge, most_popular, is_published, sort_order
         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          pkg.id,
          slug,
          city.city,
          pkg.stars,
          pkg.nights,
          pkg.roomType,
          pkg.month,
          pkg.makkahHotel,
          pkg.makkahNights,
          pkg.makkahRating ?? null,
          pkg.makkahDistance ?? null,
          pkg.madinahHotel,
          pkg.madinahNights,
          pkg.madinahRating ?? null,
          pkg.madinahDistance ?? null,
          pkg.price,
          pkg.priceDisplay,
          pkg.name ?? null,
          pkg.tier ?? null,
          j(pkg.departureDates),
          j(pkg.roomRates),
          j(pkg.flight),
          j(pkg.inclusions),
          pkg.badge ?? null,
          pkg.mostPopular ? 1 : 0,
          1, // is_published
          sortOrder,
        ] satisfies unknown[],
      );
      sortOrder += 1;
      inserted += 1;
    }
  }
  console.log(`[seed] inserted ${inserted} umrah package(s).`);
}

async function seedReviews(): Promise<void> {
  const [countRows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS n FROM reviews",
  );
  if (Number(countRows[0]?.n ?? 0) > 0) {
    console.log("[seed] reviews already populated — skip.");
    return;
  }
  for (let i = 1; i <= 5; i += 1) {
    await pool.query(
      `INSERT INTO reviews (author_name, location, rating, body, source, is_sample, is_published)
       VALUES (?,?,?,?,?,?,?)`,
      [
        `Sample Review ${i}`,
        "Australia",
        5,
        "[SAMPLE — replace with a real customer review before publishing] This is a placeholder review.",
        "manual",
        1, // is_sample
        0, // is_published
      ],
    );
  }
  console.log("[seed] inserted 5 sample reviews (all unpublished).");
}

async function seedSettings(): Promise<void> {
  const settings: Record<string, string> = {
    business_name: "Farland Holidays",
    contact_phone: "+61 0 0000 0000",
    contact_whatsapp: "",
    contact_email: "",
    abn: "",
    address: "",
  };
  for (const [key, value] of Object.entries(settings)) {
    // INSERT IGNORE skips keys that already exist (PK on `key`).
    await pool.query(
      "INSERT IGNORE INTO site_settings (`key`, value) VALUES (?, ?)",
      [key, JSON.stringify(value)],
    );
  }
  console.log("[seed] ensured site_settings defaults.");
}

const PRIVACY_BODY = `Template — have this reviewed before relying on it.

This Privacy Policy explains how Farland Holidays ("we", "us", "our") collects, uses, holds, and discloses your personal information. We handle personal information in accordance with the *Privacy Act 1988* (Cth) and the Australian Privacy Principles (APPs).

## Information we collect
We collect personal information you provide when you make an enquiry or booking, such as your name, email address, phone number, and travel preferences.

## How we use your information
We use your personal information to respond to enquiries, arrange the travel services you request, and communicate with you about your booking.

## Disclosure
We may disclose your information to third parties — such as airlines, hotels, and travel partners — only as needed to fulfil your booking. We do not sell your personal information.

## Data security
We take reasonable steps to protect your personal information from misuse, interference, loss, and unauthorised access, modification, or disclosure.

## Access and correction
Under the Australian Privacy Principles you may request access to, or correction of, the personal information we hold about you. Contact us to make a request.

## Complaints
If you have a concern about how we have handled your personal information, please contact us. You may also lodge a complaint with the Office of the Australian Information Commissioner (OAIC).

## Contact
[Add your business contact details here before publishing.]`;

const TERMS_BODY = `Template — have this reviewed before relying on it.

These Terms & Conditions govern your use of the Farland Holidays website and the travel services we arrange. Please read them carefully. They are governed by the laws of Australia.

## Bookings and payments
A booking is confirmed only once we issue a written confirmation. Deposit amounts and final payment due dates are advised at the time of booking.

## Prices
Prices are quoted in Australian dollars (AUD) and are subject to availability and confirmation at the time of booking.

## Cancellations and changes
Cancellation and amendment fees may apply and will be advised before you confirm your booking. Some supplier payments may be non-refundable.

## Travel documents and insurance
You are responsible for ensuring you hold valid passports, visas, and any other required travel documents. We strongly recommend appropriate travel insurance.

## Liability
We arrange travel services as an agent for airlines, hotels, and other suppliers. We are not responsible for the acts or omissions of those suppliers, except to the extent required by law.

## Australian Consumer Law
Nothing in these terms excludes, restricts, or modifies any consumer guarantee, right, or remedy you have under the Australian Consumer Law that cannot lawfully be excluded.

## Contact
[Add your business contact details here before publishing.]`;

async function seedContent(): Promise<void> {
  const rows: Array<{ key: string; title: string; body: string }> = [
    { key: "privacy_policy", title: "Privacy Policy", body: PRIVACY_BODY },
    { key: "terms", title: "Terms & Conditions", body: TERMS_BODY },
  ];
  for (const row of rows) {
    await pool.query(
      "INSERT IGNORE INTO site_content (`key`, title, body) VALUES (?, ?, ?)",
      [row.key, row.title, row.body],
    );
  }
  console.log("[seed] ensured site_content (privacy_policy, terms).");
}

/** Runs every seed in dependency order. Each step is individually idempotent. */
export async function seedAll(): Promise<void> {
  await seedAdmin();
  await seedUmrahPackages();
  await seedReviews();
  await seedSettings();
  await seedContent();
}

// re-export for callers that want the raw data
export { UMRAH_CITIES };
export type { UmrahPackage };
