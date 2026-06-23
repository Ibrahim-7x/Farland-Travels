import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { pool } from "../src/db/pool";

const app = createApp();
const HIDDEN_ID = "test-hidden-pkg";
const HIDDEN_DEAL = "test-hidden-deal";

beforeAll(async () => {
  // Insert one unpublished package to prove the public endpoint filters it out.
  await pool.query("DELETE FROM umrah_packages WHERE id = ?", [HIDDEN_ID]);
  await pool.query(
    `INSERT INTO umrah_packages (id, slug, city, stars, nights, room_type, price, is_published, sort_order)
     VALUES (?, ?, 'Perth', '5 Star', '7 nights', 'Quad', 999, 0, 999)`,
    [HIDDEN_ID, HIDDEN_ID],
  );

  // Same, for destinations.
  await pool.query("DELETE FROM destinations WHERE id = ?", [HIDDEN_DEAL]);
  await pool.query(
    `INSERT INTO destinations (id, slug, name, is_published, sort_order)
     VALUES (?, ?, 'Hidden Deal', 0, 999)`,
    [HIDDEN_DEAL, HIDDEN_DEAL],
  );
});

afterAll(async () => {
  await pool.query("DELETE FROM umrah_packages WHERE id = ?", [HIDDEN_ID]);
  await pool.query("DELETE FROM destinations WHERE id = ?", [HIDDEN_DEAL]);
  await pool.end();
});

describe("public visibility", () => {
  it("GET /api/umrah-packages returns only published rows", async () => {
    const res = await request(app).get("/api/umrah-packages");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((p: { isPublished: boolean }) => p.isPublished)).toBe(
      true,
    );
    expect(
      res.body.some((p: { id: string }) => p.id === HIDDEN_ID),
    ).toBe(false);
  });

  it("GET /api/destinations returns only published deals", async () => {
    const res = await request(app).get("/api/destinations");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(
      res.body.every((d: { isPublished: boolean }) => d.isPublished),
    ).toBe(true);
    expect(res.body.some((d: { id: string }) => d.id === HIDDEN_DEAL)).toBe(
      false,
    );
  });

  it("GET /api/destinations/:slug 404s for an unpublished deal", async () => {
    const res = await request(app).get(`/api/destinations/${HIDDEN_DEAL}`);
    expect(res.status).toBe(404);
  });

  it("GET /api/reviews returns only published reviews (none seeded → empty)", async () => {
    const res = await request(app).get("/api/reviews");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("GET /api/settings/public never exposes abn", async () => {
    const res = await request(app).get("/api/settings/public");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("businessName");
    expect(res.body).not.toHaveProperty("abn");
  });
});
