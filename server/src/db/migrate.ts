import fs from "node:fs";
import path from "node:path";
import mysql, { type RowDataPacket } from "mysql2/promise";
import { env } from "../config/env";

const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

/**
 * Tiny migration runner: applies every src/migrations/*.sql file (in filename
 * order) that has not been recorded in `migrations_log`, each inside a
 * transaction. Intentionally dependency-free — no Prisma/Knex.
 */
export async function runMigrations(): Promise<void> {
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    multipleStatements: true,
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT filename FROM migrations_log",
    );
    const applied = new Set(rows.map((r) => r.filename as string));

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`•  skip    ${file}`);
        continue;
      }
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
      await connection.beginTransaction();
      try {
        await connection.query(sql);
        await connection.query(
          "INSERT INTO migrations_log (filename) VALUES (?)",
          [file],
        );
        await connection.commit();
        console.log(`✓  applied ${file}`);
        count += 1;
      } catch (err) {
        await connection.rollback();
        throw new Error(
          `Migration ${file} failed: ${(err as Error).message}`,
        );
      }
    }

    console.log(
      count === 0
        ? "✅ Database already up to date."
        : `✅ Applied ${count} migration(s).`,
    );
  } finally {
    await connection.end();
  }
}

// Only auto-run when invoked directly (`tsx src/db/migrate.ts`), not on import.
if (require.main === module) {
  runMigrations().catch((err) => {
    console.error("❌ Migration error:", err);
    process.exit(1);
  });
}
