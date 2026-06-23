import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../../db/pool";
import { asyncHandler } from "../../utils/http";
import { mapPackageRow } from "../../db/mappers";

export const umrahPublicRouter = Router();

// GET /api/umrah-packages — published packages only, ordered for grouping.
umrahPublicRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM umrah_packages
       WHERE is_published = 1
       ORDER BY city ASC, sort_order ASC, id ASC`,
    );
    res.json(rows.map(mapPackageRow));
  }),
);
