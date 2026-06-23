import { Router } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";
import { mapEnquiryRow } from "../../db/mappers";

export const enquiriesAdminRouter = Router();

const listQuerySchema = z.object({
  status: z.enum(["new", "contacted", "closed"]).optional(),
  type: z.enum(["holiday", "umrah", "quote"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

// GET /api/admin/enquiries?status=&type=&page=&pageSize=
enquiriesAdminRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { status, type, page, pageSize } = listQuerySchema.parse(req.query);

    const where: string[] = [];
    const params: unknown[] = [];
    if (status) {
      where.push("status = ?");
      params.push(status);
    }
    if (type) {
      where.push("type = ?");
      params.push(type);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM enquiries ${whereSql}`,
      params,
    );
    const total = Number(countRows[0]?.total ?? 0);

    const offset = (page - 1) * pageSize;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM enquiries ${whereSql} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset],
    );

    res.json({
      items: rows.map(mapEnquiryRow),
      total,
      page,
      pageSize,
    });
  }),
);

function parseId(raw: string | undefined): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0)
    throw new ApiError(404, "Enquiry not found");
  return id;
}

// GET /api/admin/enquiries/:id
enquiriesAdminRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM enquiries WHERE id = ?",
      [parseId(req.params.id)],
    );
    const row = rows[0];
    if (!row) throw new ApiError(404, "Enquiry not found");
    res.json(mapEnquiryRow(row));
  }),
);

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

// PATCH /api/admin/enquiries/:id/status
enquiriesAdminRouter.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const { status } = statusSchema.parse(req.body);
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE enquiries SET status = ? WHERE id = ?",
      [status, id],
    );
    if (result.affectedRows === 0) throw new ApiError(404, "Enquiry not found");
    res.json({ id, status });
  }),
);
