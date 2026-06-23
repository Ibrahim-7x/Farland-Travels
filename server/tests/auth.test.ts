import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { pool } from "../src/db/pool";

const app = createApp();
const EMAIL = "admin@test.local";
const PASSWORD = "test-password-123";

afterAll(async () => {
  await pool.end();
});

describe("auth", () => {
  it("logs in with correct credentials and sets an httpOnly cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: EMAIL, password: PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: EMAIL });
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(String(cookies)).toMatch(/farland_admin=/);
    expect(String(cookies)).toMatch(/HttpOnly/i);
  });

  it("rejects login with a wrong password (401)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: EMAIL, password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  it("returns 401 from /api/auth/me without a cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns the admin email from /api/auth/me with a valid cookie", async () => {
    const agent = request.agent(app);
    await agent
      .post("/api/auth/login")
      .send({ email: EMAIL, password: PASSWORD });

    const res = await agent.get("/api/auth/me");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: EMAIL });
  });
});
