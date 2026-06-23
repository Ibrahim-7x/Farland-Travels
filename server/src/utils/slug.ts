import { randomBytes } from "node:crypto";

/** url-safe slug, capped at the column width (100). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/** Short random hex suffix for generated ids/slugs. */
export function randomId(): string {
  return randomBytes(4).toString("hex");
}
