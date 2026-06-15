import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorHandler, notFound } from "./middleware/errorHandler";
import { verifyJWT } from "./middleware/auth";

// Public routers (no auth)
import { umrahPublicRouter } from "./routes/public/umrah";
import { reviewsPublicRouter } from "./routes/public/reviews";
import { contentPublicRouter } from "./routes/public/content";
import { settingsPublicRouter } from "./routes/public/settings";
import { enquiriesPublicRouter } from "./routes/public/enquiries";

// Admin/auth routers
import { authRouter } from "./routes/admin/auth";
import { packagesAdminRouter } from "./routes/admin/packages";
import { reviewsAdminRouter } from "./routes/admin/reviews";
import { enquiriesAdminRouter } from "./routes/admin/enquiries";
import { contentAdminRouter } from "./routes/admin/content";
import { settingsAdminRouter } from "./routes/admin/settings";

export function createApp(): Express {
  const app = express();

  // Behind Apache/Passenger on cPanel — trust a single proxy hop so
  // express-rate-limit reads the real client IP.
  app.set("trust proxy", 1);

  app.use(helmet());

  // CORS locked to same origin: requests with no Origin header (same-origin
  // browser requests, the Vite dev proxy, server-to-server) are allowed;
  // genuine cross-origin browser requests get no CORS headers and are blocked.
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin),
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  // ── Public API ──
  app.use("/api/umrah-packages", umrahPublicRouter);
  app.use("/api/reviews", reviewsPublicRouter);
  app.use("/api/content", contentPublicRouter);
  app.use("/api/settings", settingsPublicRouter);
  app.use("/api/enquiries", enquiriesPublicRouter);

  // ── Auth ──
  app.use("/api/auth", authRouter);

  // ── Admin API (JWT-guarded) ──
  app.use("/api/admin/umrah-packages", verifyJWT, packagesAdminRouter);
  app.use("/api/admin/reviews", verifyJWT, reviewsAdminRouter);
  app.use("/api/admin/enquiries", verifyJWT, enquiriesAdminRouter);
  app.use("/api/admin/content", verifyJWT, contentAdminRouter);
  app.use("/api/admin/settings", verifyJWT, settingsAdminRouter);

  // Unmatched API routes → JSON 404; everything → error handler.
  app.use("/api", notFound);
  app.use(errorHandler);

  return app;
}
