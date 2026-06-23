import { seedAll } from "../seeds";
import { pool } from "./pool";

seedAll()
  .then(() => {
    console.log("✅ Seed complete.");
  })
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
