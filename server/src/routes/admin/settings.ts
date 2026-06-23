import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/pool";
import { asyncHandler } from "../../utils/http";

export const settingsAdminRouter = Router();

const ALLOWED_KEYS = [
  "business_name",
  "contact_phone",
  "contact_whatsapp",
  "contact_email",
  "abn",
  "address",
] as const;

// GET /api/admin/settings — all settings (admin sees abn too).
settingsAdminRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT `key`, value FROM site_settings",
    );
    const out: Record<string, unknown> = {};
    for (const key of ALLOWED_KEYS) out[key] = "";
    for (const r of rows) out[r.key as string] = r.value;
    res.json(out);
  }),
);

// PUT /api/admin/settings — update one or more known keys (string values).
const settingsUpdateSchema = z
  .object({
    business_name: z.string().max(255).optional(),
    contact_phone: z.string().max(50).optional(),
    contact_whatsapp: z.string().max(50).optional(),
    contact_email: z.string().max(255).optional(),
    abn: z.string().max(50).optional(),
    address: z.string().max(500).optional(),
  })
  .strict();

settingsAdminRouter.put(
  "/",
  asyncHandler(async (req, res) => {
    const updates = settingsUpdateSchema.parse(req.body);
    const entries = Object.entries(updates).filter(
      ([, value]) => value !== undefined,
    );

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const [key, value] of entries) {
        await conn.query(
          `INSERT INTO site_settings (\`key\`, value) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE value = VALUES(value)`,
          [key, JSON.stringify(value)],
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT `key`, value FROM site_settings",
    );
    const out: Record<string, unknown> = {};
    for (const key of ALLOWED_KEYS) out[key] = "";
    for (const r of rows) out[r.key as string] = r.value;
    res.json(out);
  }),
);
