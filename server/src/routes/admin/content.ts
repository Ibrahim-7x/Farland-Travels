import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";

export const contentAdminRouter = Router();

const VALID_KEYS = new Set(["privacy_policy", "terms"]);

const contentSchema = z.object({
  title: z.string().trim().min(1).max(255),
  body: z.string().min(1),
});

// GET /api/admin/content/:key
contentAdminRouter.get(
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

// PUT /api/admin/content/:key — update (or create) title + body; touches updated_at.
contentAdminRouter.put(
  "/:key",
  asyncHandler(async (req, res) => {
    const key = req.params.key ?? "";
    if (!VALID_KEYS.has(key)) throw new ApiError(404, "Content not found");
    const { title, body } = contentSchema.parse(req.body);

    await pool.query(
      `INSERT INTO site_content (\`key\`, title, body) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body)`,
      [key, title, body],
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT `key`, title, body, updated_at FROM site_content WHERE `key` = ?",
      [key],
    );
    const row = rows[0];
    res.json({
      key,
      title: row?.title as string,
      body: row?.body as string,
      updatedAt: row?.updated_at as string,
    });
  }),
);
