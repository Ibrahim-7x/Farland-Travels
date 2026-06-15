import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../../db/pool";
import { asyncHandler } from "../../utils/http";

export const settingsPublicRouter = Router();

// Whitelist — abn and any future sensitive keys are NEVER exposed here.
const PUBLIC_KEYS = [
  "business_name",
  "contact_phone",
  "contact_whatsapp",
  "contact_email",
  "address",
] as const;

// GET /api/settings/public — only whitelisted public contact settings.
settingsPublicRouter.get(
  "/public",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT `key`, value FROM site_settings WHERE `key` IN (?)",
      [PUBLIC_KEYS],
    );
    const byKey: Record<string, unknown> = {};
    for (const r of rows) byKey[r.key as string] = r.value;

    res.json({
      businessName: (byKey.business_name as string) ?? "",
      contactPhone: (byKey.contact_phone as string) ?? "",
      contactWhatsapp: (byKey.contact_whatsapp as string) ?? "",
      contactEmail: (byKey.contact_email as string) ?? "",
      address: (byKey.address as string) ?? "",
    });
  }),
);
