import { Router } from "express";
import type { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool } from "../../db/pool";
import { asyncHandler, ApiError } from "../../utils/http";
import { authLimiter } from "../../middleware/rateLimiter";
import {
  type AuthedRequest,
  clearAuthCookie,
  issueAuthCookie,
  verifyJWT,
} from "../../middleware/auth";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

// POST /api/auth/login
authRouter.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, email, password_hash FROM admin_users WHERE email = ?",
      [email],
    );
    const user = rows[0];
    // Compare even when the user is missing to reduce timing signal.
    const hash = (user?.password_hash as string) ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
    const ok = await bcrypt.compare(password, hash);
    if (!user || !ok) throw new ApiError(401, "Invalid email or password");

    issueAuthCookie(res, { sub: user.id as number, email: user.email as string });
    res.json({ email: user.email as string });
  }),
);

// POST /api/auth/logout
authRouter.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// GET /api/auth/me
authRouter.get("/me", verifyJWT, (req, res) => {
  res.json({ email: (req as AuthedRequest).admin?.email });
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

// POST /api/auth/change-password
authRouter.post(
  "/change-password",
  verifyJWT,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body,
    );
    const admin = (req as AuthedRequest).admin;
    if (!admin) throw new ApiError(401, "Not authenticated");

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT password_hash FROM admin_users WHERE id = ?",
      [admin.sub],
    );
    const user = rows[0];
    if (!user) throw new ApiError(404, "Account not found");

    const ok = await bcrypt.compare(
      currentPassword,
      user.password_hash as string,
    );
    if (!ok) throw new ApiError(400, "Current password is incorrect");

    const newHash = await bcrypt.hash(newPassword, 12);
    await pool.query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [
      newHash,
      admin.sub,
    ]);
    res.json({ ok: true });
  }),
);
