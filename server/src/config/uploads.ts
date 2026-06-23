import fs from "node:fs";
import path from "node:path";
import { env } from "./env";

/**
 * Absolute path to the directory that holds admin-uploaded images. Resolved
 * once at startup from UPLOADS_DIR (default: <server>/uploads). Files here are
 * served publicly at /api/uploads/<file>.
 */
export const UPLOADS_DIR = path.resolve(
  env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads"),
);

/** Public URL path uploaded files are served under. */
export const UPLOADS_URL_PREFIX = "/api/uploads";

/** Create the uploads directory if it doesn't exist yet (idempotent). */
export function ensureUploadsDir(): void {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
