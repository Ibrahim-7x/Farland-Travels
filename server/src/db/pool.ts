import mysql from "mysql2/promise";
import { env } from "../config/env";

/**
 * Shared connection pool used by every route/service. `dateStrings` keeps
 * TIMESTAMP columns as plain strings (no JS Date timezone surprises), and
 * JSON columns are parsed automatically by mysql2.
 */
export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  timezone: "Z",
  charset: "utf8mb4_general_ci",
});

export type { PoolConnection } from "mysql2/promise";
