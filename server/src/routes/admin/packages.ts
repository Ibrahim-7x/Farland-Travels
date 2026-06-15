import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";
import { mapPackageRow } from "../../db/mappers";
import { randomId, slugify } from "../../utils/slug";

export const packagesAdminRouter = Router();

const roomRateSchema = z.object({
  room: z.string().min(1),
  priceDisplay: z.string().min(1),
});
const flightSchema = z.object({
  airline: z.string().min(1),
  routing: z.string().min(1),
});

const packageInputSchema = z.object({
  id: z.string().trim().min(1).max(50).optional(),
  slug: z.string().trim().min(1).max(100).optional(),
  city: z.string().trim().min(1).max(50),
  stars: z.string().trim().min(1).max(50),
  nights: z.string().trim().min(1).max(50),
  roomType: z.string().trim().min(1).max(50),
  month: z.string().trim().max(50).nullish(),
  makkahHotel: z.string().trim().max(255).nullish(),
  makkahNights: z.string().trim().max(50).nullish(),
  makkahRating: z.coerce.number().min(0).max(5).nullish(),
  makkahDistance: z.string().trim().max(100).nullish(),
  madinahHotel: z.string().trim().max(255).nullish(),
  madinahNights: z.string().trim().max(50).nullish(),
  madinahRating: z.coerce.number().min(0).max(5).nullish(),
  madinahDistance: z.string().trim().max(100).nullish(),
  price: z.coerce.number().nonnegative(),
  priceDisplay: z.string().trim().max(50).nullish(),
  name: z.string().trim().max(255).nullish(),
  tier: z.enum(["Economy", "Premium", "VIP"]).nullish(),
  departureDates: z.array(z.string()).nullish(),
  roomRates: z.array(roomRateSchema).nullish(),
  flight: flightSchema.nullish(),
  inclusions: z
    .array(
      z.enum(["visa", "flights", "transfers", "breakfast", "ziyarah", "guide"]),
    )
    .nullish(),
  badge: z.string().trim().max(100).nullish(),
  mostPopular: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

type PackageInput = z.infer<typeof packageInputSchema>;

// Content columns (everything except id / slug / is_published / sort_order / timestamps).
const CONTENT_COLUMNS = [
  "city",
  "stars",
  "nights",
  "room_type",
  "month",
  "makkah_hotel",
  "makkah_nights",
  "makkah_rating",
  "makkah_distance",
  "madinah_hotel",
  "madinah_nights",
  "madinah_rating",
  "madinah_distance",
  "price",
  "price_display",
  "name",
  "tier",
  "departure_dates",
  "room_rates",
  "flight",
  "inclusions",
  "badge",
  "most_popular",
] as const;

const j = (value: unknown): string | null =>
  value == null ? null : JSON.stringify(value);

function contentValues(d: PackageInput): unknown[] {
  return [
    d.city,
    d.stars,
    d.nights,
    d.roomType,
    d.month ?? null,
    d.makkahHotel ?? null,
    d.makkahNights ?? null,
    d.makkahRating ?? null,
    d.makkahDistance ?? null,
    d.madinahHotel ?? null,
    d.madinahNights ?? null,
    d.madinahRating ?? null,
    d.madinahDistance ?? null,
    d.price,
    d.priceDisplay ?? null,
    d.name ?? null,
    d.tier ?? null,
    j(d.departureDates),
    j(d.roomRates),
    j(d.flight),
    j(d.inclusions),
    d.badge ?? null,
    d.mostPopular ? 1 : 0,
  ];
}

function isDuplicateError(err: unknown): boolean {
  return (err as { code?: string })?.code === "ER_DUP_ENTRY";
}

async function fetchPackage(id: string | undefined) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM umrah_packages WHERE id = ?",
    [id],
  );
  return rows[0];
}

/** Enforce "at most one mostPopular per city". */
async function clearOtherMostPopular(city: string, keepId: string) {
  await pool.query(
    "UPDATE umrah_packages SET most_popular = 0 WHERE city = ? AND id <> ?",
    [city, keepId],
  );
}

// GET /api/admin/umrah-packages — all packages (published + unpublished).
packagesAdminRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM umrah_packages ORDER BY city ASC, sort_order ASC, id ASC",
    );
    res.json(rows.map(mapPackageRow));
  }),
);

// POST /api/admin/umrah-packages/reorder — bulk sort update in a transaction.
const reorderSchema = z.array(
  z.object({ id: z.string().min(1), sort_order: z.coerce.number().int() }),
);
packagesAdminRouter.post(
  "/reorder",
  asyncHandler(async (req, res) => {
    const items = reorderSchema.parse(req.body);
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const item of items) {
        await conn.query(
          "UPDATE umrah_packages SET sort_order = ? WHERE id = ?",
          [item.sort_order, item.id],
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    res.json({ ok: true, updated: items.length });
  }),
);

// POST /api/admin/umrah-packages — create.
packagesAdminRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = packageInputSchema.parse(req.body);
    const id = data.id?.trim() || `${slugify(data.city)}-${randomId()}`;
    const slug =
      data.slug?.trim() ||
      `${slugify(`${data.city} ${data.name ?? id}`)}-${randomId()}`;

    // sort_order defaults to end of the city list.
    const [maxRows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM umrah_packages WHERE city = ?",
      [data.city],
    );
    const sortOrder = data.sortOrder ?? Number(maxRows[0]?.next ?? 0);
    const isPublished = data.isPublished ? 1 : 0;

    try {
      await pool.query(
        `INSERT INTO umrah_packages (id, slug, ${CONTENT_COLUMNS.join(", ")}, is_published, sort_order)
         VALUES (?, ?, ${CONTENT_COLUMNS.map(() => "?").join(", ")}, ?, ?)`,
        [id, slug, ...contentValues(data), isPublished, sortOrder],
      );
    } catch (err) {
      if (isDuplicateError(err)) {
        throw new ApiError(409, "A package with this id or slug already exists");
      }
      throw err;
    }

    if (data.mostPopular) await clearOtherMostPopular(data.city, id);

    const row = await fetchPackage(id);
    res.status(201).json(row ? mapPackageRow(row) : { id });
  }),
);

// GET /api/admin/umrah-packages/:id
packagesAdminRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const row = await fetchPackage(req.params.id);
    if (!row) throw new ApiError(404, "Package not found");
    res.json(mapPackageRow(row));
  }),
);

// PUT /api/admin/umrah-packages/:id — update content fields (publish/order have own endpoints).
packagesAdminRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id ?? "";
    const existing = await fetchPackage(id);
    if (!existing) throw new ApiError(404, "Package not found");

    const data = packageInputSchema.parse(req.body);
    const slug = data.slug?.trim() || (existing.slug as string);

    const setClause = ["slug = ?", ...CONTENT_COLUMNS.map((c) => `${c} = ?`)].join(
      ", ",
    );
    try {
      await pool.query(
        `UPDATE umrah_packages SET ${setClause} WHERE id = ?`,
        [slug, ...contentValues(data), id],
      );
    } catch (err) {
      if (isDuplicateError(err)) {
        throw new ApiError(409, "Another package already uses this slug");
      }
      throw err;
    }

    if (data.mostPopular) await clearOtherMostPopular(data.city, id);

    const row = await fetchPackage(id);
    res.json(row ? mapPackageRow(row) : { id });
  }),
);

// DELETE /api/admin/umrah-packages/:id
packagesAdminRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const existing = await fetchPackage(req.params.id);
    if (!existing) throw new ApiError(404, "Package not found");
    await pool.query("DELETE FROM umrah_packages WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ ok: true });
  }),
);

// PATCH /api/admin/umrah-packages/:id/publish — toggle is_published.
packagesAdminRouter.patch(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const existing = await fetchPackage(req.params.id);
    if (!existing) throw new ApiError(404, "Package not found");
    const next = existing.is_published ? 0 : 1;
    await pool.query(
      "UPDATE umrah_packages SET is_published = ? WHERE id = ?",
      [next, req.params.id],
    );
    res.json({ id: req.params.id, isPublished: Boolean(next) });
  }),
);

// POST /api/admin/umrah-packages/:id/duplicate — clone unpublished at end of city list.
packagesAdminRouter.post(
  "/:id/duplicate",
  asyncHandler(async (req, res) => {
    const src = await fetchPackage(req.params.id);
    if (!src) throw new ApiError(404, "Package not found");

    const newId = `${src.id}-copy-${randomId()}`.slice(0, 50);
    const newSlug = `${(src.slug as string).slice(0, 80)}-copy-${randomId()}`.slice(
      0,
      100,
    );
    const [maxRows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM umrah_packages WHERE city = ?",
      [src.city],
    );
    const nextSort = Number(maxRows[0]?.next ?? 0);

    await pool.query(
      `INSERT INTO umrah_packages
         (id, slug, city, stars, nights, room_type, month,
          makkah_hotel, makkah_nights, makkah_rating, makkah_distance,
          madinah_hotel, madinah_nights, madinah_rating, madinah_distance,
          price, price_display, name, tier,
          departure_dates, room_rates, flight, inclusions,
          badge, most_popular, is_published, sort_order)
       SELECT ?, ?, city, stars, nights, room_type, month,
          makkah_hotel, makkah_nights, makkah_rating, makkah_distance,
          madinah_hotel, madinah_nights, madinah_rating, madinah_distance,
          price, price_display, CONCAT(COALESCE(name, ''), ' (copy)'), tier,
          departure_dates, room_rates, flight, inclusions,
          badge, 0, 0, ?
       FROM umrah_packages WHERE id = ?`,
      [newId, newSlug, nextSort, req.params.id],
    );

    const row = await fetchPackage(newId);
    res.status(201).json(row ? mapPackageRow(row) : { id: newId });
  }),
);
