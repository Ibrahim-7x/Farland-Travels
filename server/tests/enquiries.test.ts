import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { pool } from "../src/db/pool";

const app = createApp();

afterAll(async () => {
  await pool.end();
});

describe("POST /api/enquiries", () => {
  it("accepts a valid enquiry (201)", async () => {
    const res = await request(app).post("/api/enquiries").send({
      type: "umrah",
      name: "Test Person",
      email: "test@example.com",
      phone: "+61 400 000 000",
      payload: { city: "Perth", note: "interested" },
      source_page: "/umrah",
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ ok: true });
    expect(typeof res.body.id).toBe("number");
  });

  it("rejects a body missing required fields (400)", async () => {
    const res = await request(app)
      .post("/api/enquiries")
      .send({ type: "umrah", name: "No Email" }); // email missing
    expect(res.status).toBe(400);
  });

  it("rejects when the honeypot field is filled (400)", async () => {
    const res = await request(app).post("/api/enquiries").send({
      type: "holiday",
      name: "Spam Bot",
      email: "bot@example.com",
      website: "http://spam.example",
    });
    expect(res.status).toBe(400);
  });

  it("rate-limits excessive submissions (429)", async () => {
    const statuses: number[] = [];
    // The limiter allows 10 / 15 min / IP; fire well past that.
    for (let i = 0; i < 15; i += 1) {
      const res = await request(app).post("/api/enquiries").send({
        type: "quote",
        name: `Flooder ${i}`,
        email: `flood${i}@example.com`,
      });
      statuses.push(res.status);
    }
    expect(statuses).toContain(429);
  });
});
