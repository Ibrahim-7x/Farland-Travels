import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";

export const contentPublicRouter = Router();

const VALID_KEYS = new Set(["privacy_policy", "terms"]);

// GET /api/content/:key — public legal/content pages only.
contentPublicRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    const key = req.params.key ?? "";
    if (!VALID_KEYS.has(key)) throw new ApiError(404, "Content not found");

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT `key`, title, body, updated_at FROM site_content WHERE `key` = ?",
      [key],
    );
    const row = rows[0];
    if (!row) throw new ApiError(404, "Content not found");

    res.json({
      key: row.key as string,
      title: row.title as string,
      body: row.body as string,
      updatedAt: row.updated_at as string,
    });
  }),
);
