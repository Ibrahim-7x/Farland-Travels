import path from "node:path";
import fs from "node:fs";
import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { verifyJWT } from "./middleware/auth";
import { UPLOADS_DIR, UPLOADS_URL_PREFIX, ensureUploadsDir } from "./config/uploads";

// Public routers (no auth)
import { umrahPublicRouter } from "./routes/public/umrah";
import { destinationsPublicRouter } from "./routes/public/destinations";
import { citiesPublicRouter } from "./routes/public/cities";
import { reviewsPublicRouter } from "./routes/public/reviews";
import { contentPublicRouter } from "./routes/public/content";
import { settingsPublicRouter } from "./routes/public/settings";
import { enquiriesPublicRouter } from "./routes/public/enquiries";

// Admin/auth routers
import { authRouter } from "./routes/admin/auth";
import { packagesAdminRouter } from "./routes/admin/packages";
import { destinationsAdminRouter } from "./routes/admin/destinations";
import { citiesAdminRouter } from "./routes/admin/cities";
import { reviewsAdminRouter } from "./routes/admin/reviews";
import { enquiriesAdminRouter } from "./routes/admin/enquiries";
import { contentAdminRouter } from "./routes/admin/content";
import { settingsAdminRouter } from "./routes/admin/settings";
import { uploadsAdminRouter } from "./routes/admin/uploads";

export function createApp(): Express {
  const app = express();

  // Behind Apache/Passenger on cPanel — trust a single proxy hop so
  // express-rate-limit reads the real client IP.
  app.set("trust proxy", 1);

  // Helmet's default Content-Security-Policy is disabled because this process
  // also serves the React SPA, which pulls in Google Fonts, Unsplash images and
  // uses inline styles — a strict default CSP would break them. (The previous
  // static-only host applied no CSP at all.) All other helmet headers stay on;
  // a tailored CSP can be added later once the external origins are enumerated.
  app.use(helmet({ contentSecurityPolicy: false }));

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

  // Dynamic API data must never be cached by the browser/proxy — otherwise an
  // admin edit won't show on the public site until the cache expires (this is
  // the "changes don't reflect even after a refresh" bug). Applied to the JSON
  // data routes below; the long-cached uploaded media (mounted before this)
  // is deliberately left untouched.
  const noStore = (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.set("Cache-Control", "no-store");
    next();
  };

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  // ── Uploaded media (public, long-cached) ──
  // Served under /api so it rides the single /api proxy that fronts the Node
  // app in production — no extra Apache rule needed.
  ensureUploadsDir();
  app.use(
    UPLOADS_URL_PREFIX,
    express.static(UPLOADS_DIR, {
      immutable: true,
      maxAge: "30d",
      fallthrough: true,
    }),
  );

  // ── Public API ──
  app.use("/api/umrah-packages", noStore, umrahPublicRouter);
  app.use("/api/destinations", noStore, destinationsPublicRouter);
  app.use("/api/cities", noStore, citiesPublicRouter);
  app.use("/api/reviews", noStore, reviewsPublicRouter);
  app.use("/api/content", noStore, contentPublicRouter);
  app.use("/api/settings", noStore, settingsPublicRouter);
  app.use("/api/enquiries", noStore, enquiriesPublicRouter);

  // ── Auth ──
  app.use("/api/auth", authRouter);

  // ── Admin API (JWT-guarded) ──
  app.use("/api/admin/umrah-packages", noStore, verifyJWT, packagesAdminRouter);
  app.use("/api/admin/destinations", noStore, verifyJWT, destinationsAdminRouter);
  app.use("/api/admin/uploads", noStore, verifyJWT, uploadsAdminRouter);
  app.use("/api/admin/cities", noStore, verifyJWT, citiesAdminRouter);
  app.use("/api/admin/reviews", noStore, verifyJWT, reviewsAdminRouter);
  app.use("/api/admin/enquiries", noStore, verifyJWT, enquiriesAdminRouter);
  app.use("/api/admin/content", noStore, verifyJWT, contentAdminRouter);
  app.use("/api/admin/settings", noStore, verifyJWT, settingsAdminRouter);

  // Unmatched API routes → JSON 404 (must come before the SPA fallback so a
  // bad /api path never returns index.html).
  app.use("/api", notFound);

  // ── Frontend (single-origin serving) ──
  // Serve the built React app and fall back to index.html for client-side
  // routes, so one Node process serves both the SPA and the API on the same
  // origin. Skipped in local dev (no build present — Vite serves the frontend).
  const clientDir = env.CLIENT_DIR
    ? path.resolve(env.CLIENT_DIR)
    : path.resolve(__dirname, "..", "public");
  if (fs.existsSync(path.join(clientDir, "index.html"))) {
    app.use(
      express.static(clientDir, {
        // Vite fingerprints asset filenames, so they can be cached hard; the
        // HTML entry point must not be cached so new deploys take effect at once.
        setHeaders: (res, filePath) => {
          if (filePath.endsWith("index.html")) {
            res.set("Cache-Control", "no-store");
          }
        },
      }),
    );
    app.get("*", (_req, res) => {
      res.sendFile(path.join(clientDir, "index.html"));
    });
  }

  app.use(errorHandler);

  return app;
}
