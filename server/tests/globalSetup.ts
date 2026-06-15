/**
 * Runs once (in the main process) before any test file. Migrates and seeds the
 * throwaway test database so every worker sees a ready schema + baseline data.
 */
export default async function setup(): Promise<void> {
  // globalSetup does not receive vitest `test.env`, so set the same defaults.
  process.env.NODE_ENV = "test";
  process.env.DB_HOST ??= "127.0.0.1";
  process.env.DB_PORT ??= "3306";
  process.env.DB_USER ??= "farland";
  process.env.DB_PASSWORD ??= "farland_dev";
  process.env.DB_NAME ??= "farland_test";
  process.env.JWT_SECRET ??= "test-secret-test-secret-test-secret";
  process.env.ADMIN_EMAIL ??= "admin@test.local";
  process.env.ADMIN_PASSWORD ??= "test-password-123";

  const { runMigrations } = await import("../src/db/migrate");
  const { seedAll } = await import("../src/seeds");
  const { pool } = await import("../src/db/pool");

  await runMigrations();
  await seedAll();
  await pool.end();
}
