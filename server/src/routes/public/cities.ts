import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../../db/pool";
import { asyncHandler } from "../../utils/http";
import { mapCityRow } from "../../db/mappers";

export const citiesPublicRouter = Router();

// GET /api/cities — full city list for the public Umrah page filter.
citiesPublicRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM cities ORDER BY sort_order ASC, name ASC",
    );
    res.json(rows.map(mapCityRow));
  }),
);
