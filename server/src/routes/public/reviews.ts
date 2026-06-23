import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../../db/pool";
import { asyncHandler } from "../../utils/http";
import { mapReviewRow } from "../../db/mappers";

export const reviewsPublicRouter = Router();

// GET /api/reviews — published reviews only, newest first.
reviewsPublicRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM reviews
       WHERE is_published = 1
       ORDER BY created_at DESC, id DESC`,
    );
    // Public payload omits internal flags (is_sample etc.).
    res.json(
      rows.map((r) => {
        const m = mapReviewRow(r);
        return {
          id: m.id,
          authorName: m.authorName,
          location: m.location,
          rating: m.rating,
          body: m.body,
          createdAt: m.createdAt,
        };
      }),
    );
  }),
);
