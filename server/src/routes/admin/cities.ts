import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";
import { mapCityRow } from "../../db/mappers";
import { slugify } from "../../utils/slug";

export const citiesAdminRouter = Router();

const cityInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

function isDuplicateError(err: unknown): boolean {
  return (err as { code?: string })?.code === "ER_DUP_ENTRY";
}

// GET /api/admin/cities — full list.
citiesAdminRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM cities ORDER BY sort_order ASC, name ASC",
    );
    res.json(rows.map(mapCityRow));
  }),
);

// POST /api/admin/cities — add a city. id is derived from the name slug.
citiesAdminRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name } = cityInputSchema.parse(req.body);
    const id = slugify(name).slice(0, 50);
    if (!id) throw new ApiError(400, "City name must contain letters or numbers");

    const [maxRows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM cities",
    );
    const sortOrder = Number(maxRows[0]?.next ?? 0);

    try {
      await pool.query(
        "INSERT INTO cities (id, name, sort_order) VALUES (?, ?, ?)",
        [id, name, sortOrder],
      );
    } catch (err) {
      if (isDuplicateError(err)) {
        throw new ApiError(409, "A city with this name already exists");
      }
      throw err;
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM cities WHERE id = ?",
      [id],
    );
    res.status(201).json(rows[0] ? mapCityRow(rows[0]) : { id, name });
  }),
);

// DELETE /api/admin/cities/:id — remove a city from the list. Packages that
// still reference the city name are left untouched (they simply won't have a
// matching dropdown entry until the city is re-added).
citiesAdminRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM cities WHERE id = ?",
      [req.params.id],
    );
    if (!result[0]) throw new ApiError(404, "City not found");
    await pool.query("DELETE FROM cities WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  }),
);
