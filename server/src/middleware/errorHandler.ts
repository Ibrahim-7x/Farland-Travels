import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/http";
import { isProd } from "../config/env";

/** 404 fallback for unmatched /api routes. */
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not found" });
}

/** Global error handler — always responds with `{ error: string }`. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  // Validation failures → 400 with a readable message.
  if (err instanceof ZodError) {
    const message = err.issues
      .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
      .join("; ");
    res.status(400).json({ error: message || "Invalid request" });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // Unexpected errors: log server-side, never leak details to clients.
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: isProd ? "Internal server error" : String((err as Error)?.message ?? err),
  });
}
