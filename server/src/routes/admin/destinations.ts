import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";
import { mapDestinationRow } from "../../db/mappers";
import { randomId, slugify } from "../../utils/slug";

export const destinationsAdminRouter = Router();

const metaItemSchema = z.object({
  strong: z.string().trim().min(1),
  rest: z.string().trim().default(""),
});
const highlightSchema = z.object({
  icon: z.string().trim().default(""),
  title: z.string().trim().min(1),
  text: z.string().trim().default(""),
});
const componentSchema = z.object({
  label: z.string().trim().min(1),
  details: z.string().trim().default(""),
});
const pricingSchema = z.object({
  month: z.string().trim().min(1),
  amount: z.string().trim().default(""),
  currency: z.string().trim().default(""),
  display: z.string().trim().min(1),
});
const subPackageSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  stars: z.string().trim().default(""),
  duration: z.string().trim().default(""),
  hotels: z.string().trim().default(""),
  roomType: z.string().trim().default(""),
  priceDisplay: z.string().trim().default(""),
});

// "What's Included" — tabs → sections → items + images.
const witImageSchema = z.object({
  src: z.string().trim().max(500).default(""),
  alt: z.string().trim().max(255).default(""),
});
const witItemSchema = z.object({
  label: z.string().trim().max(120).default(""),
  primary: z.string().trim().max(255).default(""),
  pills: z.array(z.string().trim().min(1)).default([]),
});
const witSectionSchema = z.object({
  icon: z.string().trim().max(16).default(""),
  title: z.string().trim().max(120).default(""),
  items: z.array(witItemSchema).default([]),
  images: z.array(witImageSchema).default([]),
});
const witTabSchema = z.object({
  id: z.string().trim().min(1).max(60),
  label: z.string().trim().max(80).default(""),
  flag: z.string().trim().max(16).default(""),
  sections: z.array(witSectionSchema).default([]),
});

const destinationInputSchema = z.object({
  id: z.string().trim().min(1).max(50).optional(),
  slug: z.string().trim().min(1).max(100).optional(),
  name: z.string().trim().min(1).max(255),
  subtitle: z.string().trim().max(255).default(""),
  region: z.string().trim().max(255).default(""),
  regionLabel: z.string().trim().max(255).default(""),
  image: z.string().trim().max(500).default(""),
  heroImage: z.string().trim().max(500).default(""),
  description: z.string().trim().default(""),
  tagline: z.string().trim().max(500).default(""),
  fromPrice: z.string().trim().max(50).default(""),
  badge: z.string().trim().max(100).nullish(),
  rating: z.string().trim().max(20).default(""),
  ratingText: z.string().trim().max(100).default(""),
  tags: z.array(z.string().trim().min(1)).default([]),
  styles: z.array(z.string().trim().min(1)).default([]),
  metaItems: z.array(metaItemSchema).default([]),
  highlights: z.array(highlightSchema).default([]),
  components: z.array(componentSchema).default([]),
  whatsIncluded: z.array(witTabSchema).default([]),
  pricing: z.array(pricingSchema).default([]),
  packages: z.array(subPackageSchema).default([]),
  packagesNote: z.string().trim().max(500).nullish(),
  transfersIncluded: z.string().trim().max(255).default(""),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

type DestinationInput = z.infer<typeof destinationInputSchema>;

// Content columns (everything except id / slug / is_published / sort_order / timestamps).
const CONTENT_COLUMNS = [
  "name",
  "subtitle",
  "region",
  "region_label",
  "image",
  "hero_image",
  "description",
  "tagline",
  "from_price",
  "badge",
  "rating",
  "rating_text",
  "tags",
  "styles",
  "meta_items",
  "highlights",
  "components",
  "whats_included",
  "pricing",
  "packages",
  "packages_note",
  "transfers_included",
] as const;

const j = (value: unknown): string | null =>
  value == null ? null : JSON.stringify(value);

function contentValues(d: DestinationInput): unknown[] {
  return [
    d.name,
    d.subtitle,
    d.region,
    d.regionLabel,
    d.image,
    d.heroImage,
    d.description,
    d.tagline,
    d.fromPrice,
    d.badge ?? null,
    d.rating,
    d.ratingText,
    j(d.tags),
    j(d.styles),
    j(d.metaItems),
    j(d.highlights),
    j(d.components),
    j(d.whatsIncluded),
    j(d.pricing),
    j(d.packages),
    d.packagesNote ?? null,
    d.transfersIncluded,
  ];
}

function isDuplicateError(err: unknown): boolean {
  return (err as { code?: string })?.code === "ER_DUP_ENTRY";
}

async function fetchDestination(id: string | undefined) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM destinations WHERE id = ?",
    [id],
  );
  return rows[0];
}

// GET /api/admin/destinations — all deals (published + unpublished).
destinationsAdminRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM destinations ORDER BY sort_order ASC, name ASC",
    );
    res.json(rows.map(mapDestinationRow));
  }),
);

// POST /api/admin/destinations/reorder — bulk sort update in a transaction.
const reorderSchema = z.array(
  z.object({ id: z.string().min(1), sort_order: z.coerce.number().int() }),
);
destinationsAdminRouter.post(
  "/reorder",
  asyncHandler(async (req, res) => {
    const items = reorderSchema.parse(req.body);
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const item of items) {
        await conn.query(
          "UPDATE destinations SET sort_order = ? WHERE id = ?",
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

// POST /api/admin/destinations — create.
destinationsAdminRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = destinationInputSchema.parse(req.body);
    const id = data.id?.trim() || `${slugify(data.name)}-${randomId()}`;
    const slug = data.slug?.trim() || slugify(data.name) || `deal-${randomId()}`;

    const [maxRows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM destinations",
    );
    const sortOrder = data.sortOrder ?? Number(maxRows[0]?.next ?? 0);
    const isPublished = data.isPublished ? 1 : 0;

    try {
      await pool.query(
        `INSERT INTO destinations (id, slug, ${CONTENT_COLUMNS.join(", ")}, is_published, sort_order)
         VALUES (?, ?, ${CONTENT_COLUMNS.map(() => "?").join(", ")}, ?, ?)`,
        [id, slug, ...contentValues(data), isPublished, sortOrder],
      );
    } catch (err) {
      if (isDuplicateError(err)) {
        throw new ApiError(
          409,
          "A destination with this id or slug already exists",
        );
      }
      throw err;
    }

    const row = await fetchDestination(id);
    res.status(201).json(row ? mapDestinationRow(row) : { id });
  }),
);

// GET /api/admin/destinations/:id
destinationsAdminRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const row = await fetchDestination(req.params.id);
    if (!row) throw new ApiError(404, "Destination not found");
    res.json(mapDestinationRow(row));
  }),
);

// PUT /api/admin/destinations/:id — update content fields.
destinationsAdminRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id ?? "";
    const existing = await fetchDestination(id);
    if (!existing) throw new ApiError(404, "Destination not found");

    const data = destinationInputSchema.parse(req.body);
    const slug = data.slug?.trim() || (existing.slug as string);

    const setClause = [
      "slug = ?",
      ...CONTENT_COLUMNS.map((c) => `${c} = ?`),
    ].join(", ");
    try {
      await pool.query(
        `UPDATE destinations SET ${setClause} WHERE id = ?`,
        [slug, ...contentValues(data), id],
      );
    } catch (err) {
      if (isDuplicateError(err)) {
        throw new ApiError(409, "Another destination already uses this slug");
      }
      throw err;
    }

    const row = await fetchDestination(id);
    res.json(row ? mapDestinationRow(row) : { id });
  }),
);

// DELETE /api/admin/destinations/:id
destinationsAdminRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const existing = await fetchDestination(req.params.id);
    if (!existing) throw new ApiError(404, "Destination not found");
    await pool.query("DELETE FROM destinations WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  }),
);

// PATCH /api/admin/destinations/:id/publish — toggle is_published.
destinationsAdminRouter.patch(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const existing = await fetchDestination(req.params.id);
    if (!existing) throw new ApiError(404, "Destination not found");
    const next = existing.is_published ? 0 : 1;
    await pool.query("UPDATE destinations SET is_published = ? WHERE id = ?", [
      next,
      req.params.id,
    ]);
    res.json({ id: req.params.id, isPublished: Boolean(next) });
  }),
);

// POST /api/admin/destinations/:id/duplicate — clone unpublished at end of list.
destinationsAdminRouter.post(
  "/:id/duplicate",
  asyncHandler(async (req, res) => {
    const src = await fetchDestination(req.params.id);
    if (!src) throw new ApiError(404, "Destination not found");

    const newId = `${src.id}-copy-${randomId()}`.slice(0, 50);
    const newSlug = `${(src.slug as string).slice(0, 80)}-copy-${randomId()}`.slice(
      0,
      100,
    );
    const [maxRows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM destinations",
    );
    const nextSort = Number(maxRows[0]?.next ?? 0);

    await pool.query(
      `INSERT INTO destinations
         (id, slug, name, subtitle, region, region_label, image, hero_image,
          description, tagline, from_price, badge, rating, rating_text,
          tags, styles, meta_items, highlights, components, whats_included,
          pricing, packages, packages_note, transfers_included,
          is_published, sort_order)
       SELECT ?, ?, CONCAT(name, ' (copy)'), subtitle, region, region_label,
          image, hero_image, description, tagline, from_price, badge, rating,
          rating_text, tags, styles, meta_items, highlights, components,
          whats_included, pricing, packages, packages_note, transfers_included,
          0, ?
       FROM destinations WHERE id = ?`,
      [newId, newSlug, nextSort, req.params.id],
    );

    const row = await fetchDestination(newId);
    res.status(201).json(row ? mapDestinationRow(row) : { id: newId });
  }),
);
