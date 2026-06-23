import type { NextFunction, Request, RequestHandler, Response } from "express";

/** Error carrying an explicit HTTP status; the global handler reads `.status`. */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/**
 * Wraps an async route handler so rejected promises reach Express's error
 * pipeline (Express 4 does not catch async errors on its own).
 */
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  ): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
