import { Router } from "express";
import type { ResultSetHeader } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";
import { enquiryLimiter } from "../../middleware/rateLimiter";
import { sendEnquiryNotification } from "../../services/mail";

export const enquiriesPublicRouter = Router();

const enquirySchema = z.object({
  type: z.enum(["holiday", "umrah", "quote"]),
  name: z.string().trim().min(1, "Name is required").max(255),
  email: z.string().trim().email("A valid email is required").max(255),
  phone: z.string().trim().max(50).optional(),
  payload: z.record(z.unknown()).optional(),
  source_page: z.string().trim().max(255).optional(),
  // Honeypot: real users never see this field, so it must be empty/absent.
  website: z.string().optional(),
});

// POST /api/enquiries — public enquiry submission (rate limited + honeypot).
enquiriesPublicRouter.post(
  "/",
  enquiryLimiter,
  asyncHandler(async (req, res) => {
    const data = enquirySchema.parse(req.body);

    if (data.website && data.website.trim() !== "") {
      throw new ApiError(400, "Invalid submission");
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO enquiries (type, name, email, phone, payload, source_page)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.type,
        data.name,
        data.email,
        data.phone && data.phone !== "" ? data.phone : null,
        data.payload ? JSON.stringify(data.payload) : null,
        data.source_page && data.source_page !== "" ? data.source_page : null,
      ],
    );

    // Best-effort email; degrades gracefully if SMTP is not configured.
    await sendEnquiryNotification({
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      sourcePage: data.source_page ?? null,
      payload: data.payload ?? null,
    });

    res.status(201).json({ id: result.insertId, ok: true });
  }),
);
