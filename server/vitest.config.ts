import { defineConfig } from "vitest/config";

// Integration tests run against a separate throwaway database (farland_test).
// These env vars are applied to test workers before any module is imported;
// dotenv (in src/config/env.ts) does not override already-set process.env keys.
const testEnv = {
  NODE_ENV: "test",
  DB_HOST: "127.0.0.1",
  DB_PORT: "3306",
  DB_USER: "farland",
  DB_PASSWORD: "farland_dev",
  DB_NAME: "farland_test",
  JWT_SECRET: "test-secret-test-secret-test-secret",
  ADMIN_EMAIL: "admin@test.local",
  ADMIN_PASSWORD: "test-password-123",
};

export default defineConfig({
  test: {
    environment: "node",
    env: testEnv,
    // Migrate + seed the test DB once, before any test file runs.
    globalSetup: ["./tests/globalSetup.ts"],
    hookTimeout: 30000,
    testTimeout: 30000,
  },
});
