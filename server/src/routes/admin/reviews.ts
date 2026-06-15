import { Router } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";
import { mapReviewRow } from "../../db/mappers";

export const reviewsAdminRouter = Router();

const reviewSchema = z.object({
  authorName: z.string().trim().min(1).max(255),
  location: z.string().trim().max(255).nullish(),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(1),
  source: z.enum(["manual", "google"]).optional(),
  isSample: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

function parseId(raw: string | undefined): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(404, "Review not found");
  return id;
}

async function fetchReview(id: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM reviews WHERE id = ?",
    [id],
  );
  return rows[0];
}

// GET /api/admin/reviews
reviewsAdminRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM reviews ORDER BY created_at DESC, id DESC",
    );
    res.json(rows.map(mapReviewRow));
  }),
);

// POST /api/admin/reviews
reviewsAdminRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = reviewSchema.parse(req.body);
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO reviews (author_name, location, rating, body, source, is_sample, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.authorName,
        data.location ?? null,
        data.rating,
        data.body,
        data.source ?? "manual",
        data.isSample ? 1 : 0,
        data.isPublished ? 1 : 0,
      ],
    );
    const row = await fetchReview(result.insertId);
    res.status(201).json(row ? mapReviewRow(row) : { id: result.insertId });
  }),
);

// GET /api/admin/reviews/:id
reviewsAdminRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const row = await fetchReview(parseId(req.params.id));
    if (!row) throw new ApiError(404, "Review not found");
    res.json(mapReviewRow(row));
  }),
);

// PUT /api/admin/reviews/:id
reviewsAdminRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await fetchReview(id);
    if (!existing) throw new ApiError(404, "Review not found");

    const data = reviewSchema.parse(req.body);
    await pool.query(
      `UPDATE reviews
         SET author_name = ?, location = ?, rating = ?, body = ?, source = ?, is_sample = ?, is_published = ?
       WHERE id = ?`,
      [
        data.authorName,
        data.location ?? null,
        data.rating,
        data.body,
        data.source ?? (existing.source as string),
        data.isSample ? 1 : 0,
        data.isPublished ? 1 : 0,
        id,
      ],
    );
    const row = await fetchReview(id);
    res.json(row ? mapReviewRow(row) : { id });
  }),
);

// DELETE /api/admin/reviews/:id
reviewsAdminRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await fetchReview(id);
    if (!existing) throw new ApiError(404, "Review not found");
    await pool.query("DELETE FROM reviews WHERE id = ?", [id]);
    res.json({ ok: true });
  }),
);

// PATCH /api/admin/reviews/:id/publish — toggle is_published.
reviewsAdminRouter.patch(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const existing = await fetchReview(id);
    if (!existing) throw new ApiError(404, "Review not found");
    const next = existing.is_published ? 0 : 1;
    await pool.query("UPDATE reviews SET is_published = ? WHERE id = ?", [
      next,
      id,
    ]);
    res.json({ id, isPublished: Boolean(next) });
  }),
);
