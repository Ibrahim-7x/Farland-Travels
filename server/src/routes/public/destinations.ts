import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";
import { mapDestinationRow } from "../../db/mappers";

export const destinationsPublicRouter = Router();

// GET /api/destinations — published deals only, in admin-set order.
destinationsPublicRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM destinations
       WHERE is_published = 1
       ORDER BY sort_order ASC, name ASC`,
    );
    res.json(rows.map(mapDestinationRow));
  }),
);

// GET /api/destinations/:slug — single published deal (for the detail page).
destinationsPublicRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM destinations WHERE slug = ? AND is_published = 1",
      [req.params.slug],
    );
    if (!rows[0]) throw new ApiError(404, "Destination not found");
    res.json(mapDestinationRow(rows[0]));
  }),
);
