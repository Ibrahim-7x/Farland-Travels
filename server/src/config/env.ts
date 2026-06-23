import "dotenv/config";
import { z } from "zod";

/** Empty strings in .env files should be treated as "unset" for optional vars. */
const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

const EnvSchema = z.object({
  // ── Server ──
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // ── MySQL ──
  DB_HOST: z.string().min(1, "DB_HOST is required"),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().min(1, "DB_NAME is required"),

  // ── Auth ──
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),

  // ── Uploads ──
  // Directory where admin-uploaded images are written and served from
  // (/api/uploads/<file>). Keep this OUTSIDE the deploy-overwrite path in
  // production (e.g. an absolute cPanel home path) so redeploys don't wipe
  // uploaded media. Defaults to <server>/uploads in dev.
  UPLOADS_DIR: z.preprocess(emptyToUndefined, z.string().optional()),

  // ── Email (optional) ──
  SMTP_HOST: z.preprocess(emptyToUndefined, z.string().optional()),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.preprocess(emptyToUndefined, z.string().optional()),
  SMTP_PASS: z.preprocess(emptyToUndefined, z.string().optional()),
  NOTIFY_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),

  // ── First admin (consumed only by `npm run seed`) ──
  ADMIN_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),
  ADMIN_PASSWORD: z.preprocess(emptyToUndefined, z.string().optional()),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast and loud — a misconfigured server should never half-start.
  console.error("❌ Invalid environment configuration:");
  for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
    console.error(`   ${key}: ${(msgs ?? []).join(", ")}`);
  }
  process.exit(1);
}

export const env = parsed.data;

/** SMTP is considered configured only when a host is present. */
export const isSmtpConfigured = (): boolean => Boolean(env.SMTP_HOST);

export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
