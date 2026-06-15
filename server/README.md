# Farland Holidays — API server

Express + TypeScript + MySQL backend for the Farland Travels site. Designed to
run on Namecheap shared cPanel via Passenger ("Setup Node.js App") on **Node 18**.
Umrah packages, reviews, enquiries, site settings, and the privacy/terms content
are stored in MySQL; destinations and deals stay static in the frontend.

---

## Local development

```bash
# 1. API server
cd server
npm install
cp .env.example .env          # then fill in values (see "Environment" below)
docker compose -f docker-compose.dev.yml up -d   # local MySQL 8 on :3306
npm run migrate               # create tables (idempotent)
npm run seed                  # admin user, 12 packages, sample reviews, settings, content
npm run dev                   # API on http://localhost:3001

# 2. In a separate terminal — frontend
cd react-app
npm install
npm run dev                   # Vite on http://localhost:5173, proxies /api → :3001
```

Open http://localhost:5173 (public site) and http://localhost:5173/admin
(admin panel — sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`).

### Useful scripts (server)

| Script            | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Run the API with hot reload (`tsx watch`)                 |
| `npm run build`   | Type-check + compile to `dist/` (`tsc`)                   |
| `npm start`       | Run the compiled server (`node dist/index.js`)            |
| `npm run migrate` | Apply pending `src/migrations/*.sql` in a transaction     |
| `npm run seed`    | Run all seeders (each is idempotent / skips if populated) |
| `npm test`        | vitest + supertest integration tests against `farland_test` |

---

## Environment variables

| Variable         | Required | Purpose                                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------------------------- |
| `PORT`           | no (3001)| Port the API listens on. cPanel/Passenger sets this in production.                        |
| `NODE_ENV`       | no       | `development` \| `production` \| `test`. Controls secure-cookie + error verbosity.        |
| `DB_HOST`        | **yes**  | MySQL host (`127.0.0.1` locally; the cPanel DB host in production).                       |
| `DB_PORT`        | no (3306)| MySQL port.                                                                              |
| `DB_USER`        | **yes**  | MySQL user (often `cpaneluser_farland` on cPanel).                                        |
| `DB_PASSWORD`    | **yes\*** | MySQL password (may be empty locally; `*` empty allowed).                                |
| `DB_NAME`        | **yes**  | Database name.                                                                            |
| `JWT_SECRET`     | **yes**  | Secret for signing admin session JWTs. Min 16 chars — use a long random string.          |
| `SMTP_HOST`      | no       | SMTP host for enquiry notifications. **If unset, enquiries are still stored** (no email). |
| `SMTP_PORT`      | no (587) | SMTP port (465 ⇒ implicit TLS).                                                           |
| `SMTP_USER`      | no       | SMTP username; also used as the `from` address.                                          |
| `SMTP_PASS`      | no       | SMTP password.                                                                           |
| `NOTIFY_EMAIL`   | no       | Where new-enquiry notifications are sent. No email is sent unless this + `SMTP_HOST` set. |
| `ADMIN_EMAIL`    | seed only| First admin's email (consumed by `npm run seed`).                                         |
| `ADMIN_PASSWORD` | seed only| First admin's password — bcrypt-hashed on seed. **Change it after first login.**          |

Invalid/missing required vars cause the server to fail fast at startup with a
clear message (zod-validated in `src/config/env.ts`).

---

## File tree

```
server/
  .env.example                 env template (documented)
  docker-compose.dev.yml       local MySQL 8 (+ healthcheck)
  docker/mysql-init.sql        creates the farland_test DB for the test suite
  package.json  tsconfig.json  vitest.config.ts
  src/
    index.ts                   listen on PORT
    app.ts                     Express app: helmet, CORS (same-origin), cookies, routes
    config/
      env.ts                   dotenv + zod-validated, typed `env`
    db/
      pool.ts                  mysql2 connection pool
      migrate.ts               transactional migration runner (migrations_log) + runMigrations()
      seed.ts                  seed CLI entrypoint
      mappers.ts               DB row → camelCase API shapes
    migrations/
      001_admin_users.sql
      002_umrah_packages.sql   (stars/nights/*_nights are VARCHAR — see note below)
      003_reviews.sql
      004_enquiries.sql
      005_site_settings.sql
      006_site_content.sql
    seeds/
      umrah-data.ts            12 packages, moved verbatim from the frontend
      index.ts                 seedAll(): admin, packages, reviews, settings, content
    routes/
      public/                  umrah.ts reviews.ts content.ts settings.ts enquiries.ts
      admin/                   auth.ts packages.ts reviews.ts enquiries.ts content.ts settings.ts
    middleware/
      auth.ts                  verifyJWT (httpOnly SameSite cookie) + issue/clear helpers
      rateLimiter.ts           auth (5/15m) + enquiry (10/15m) limiters
      errorHandler.ts          zod-aware global error handler + 404
    services/
      mail.ts                  nodemailer, graceful degradation when SMTP unset
    utils/
      http.ts                  asyncHandler + ApiError
      slug.ts                  slugify + randomId
  tests/
    globalSetup.ts             migrate + seed farland_test once
    auth.test.ts  enquiries.test.ts  public-visibility.test.ts
```

> **Schema note:** `umrah_packages.stars`, `.nights`, `.makkah_nights`,
> `.madinah_nights` are `VARCHAR`, not `INT`. The source data holds descriptive
> strings such as `"4 & 5 Star"`, `"5/4 Star"`, `"10 nights"`, `"6 nights"`,
> which cannot be stored as integers without inventing a normalisation that
> isn't in the data. Storing them verbatim keeps the existing card/modal UI
> working unchanged.

---

## API surface (all under `/api`)

**Public:** `GET /umrah-packages`, `GET /reviews`, `GET /content/:key`
(`privacy_policy`|`terms`), `GET /settings/public` (never exposes `abn`),
`POST /enquiries` (zod + honeypot + rate limit).

**Auth:** `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`,
`POST /auth/change-password`.

**Admin (JWT required):** `/admin/umrah-packages` (CRUD + `PATCH /:id/publish`,
`POST /:id/duplicate`, `POST /reorder`), `/admin/reviews` (CRUD + publish),
`/admin/enquiries` (list/detail/`PATCH /:id/status`), `/admin/content/:key`
(GET/PUT), `/admin/settings` (GET/PUT).

---

## Production (cPanel) notes

- Serve the built `react-app/dist` as the site root and proxy `/api` to the Node
  app so the frontend and API share one origin (CORS is locked to same-origin).
- Create the MySQL database + user under **MySQL Databases**, set the `DB_*`
  vars accordingly, then run `npm run migrate` and `npm run seed` once.
- Set a strong `JWT_SECRET` and change the seeded admin password after first login.

---

## Manual verification checklist

1. **Admin login** — sign in at `/admin`; a dashboard warning banner appears
   while settings are still placeholders.
2. **Packages → live site** — create/edit/unpublish a package in
   `/admin/packages`; reload `/umrah` and confirm the change (unpublished
   packages disappear from the public page).
3. **Enquiries** — submit each form (Contact wizard holiday + umrah,
   Destination detail, Search results); confirm rows appear under
   `/admin/enquiries`, and (if SMTP configured) an email arrives at
   `NOTIFY_EMAIL`.
4. **Content** — edit the Privacy Policy in `/admin/content`; reload `/privacy`
   and see the change.
5. **Settings → footer/contact** — set Business name / phone / WhatsApp / email
   in `/admin/settings`; confirm the footer and Contact page update, and that
   the displayed WhatsApp number and its `wa.me` link use the same value.
