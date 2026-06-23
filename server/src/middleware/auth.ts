import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env, isProd } from "../config/env";

export const AUTH_COOKIE = "farland_admin";
const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface AuthTokenPayload {
  sub: number; // admin_users.id
  email: string;
}

export interface AuthedRequest extends Request {
  admin?: AuthTokenPayload;
}

/** Sign a session token and attach it as an httpOnly cookie. */
export function issueAuthCookie(res: Response, payload: AuthTokenPayload): void {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: TOKEN_TTL_SECONDS,
  });
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
    maxAge: TOKEN_TTL_SECONDS * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
    path: "/",
  });
}

/** Reject the request unless a valid admin JWT cookie is present. */
export function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = (req.cookies as Record<string, string> | undefined)?.[
    AUTH_COOKIE
  ];
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as unknown as AuthTokenPayload;
    (req as AuthedRequest).admin = { sub: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
}
