-- Admin-managed list of Umrah departure cities. Packages still store the
-- city as a plain string (umrah_packages.city); this table is the canonical
-- list the admin panel and the public city filter draw from. Adding/removing
-- a city here does NOT cascade to packages — it only controls the dropdown.
CREATE TABLE cities (
  id VARCHAR(50) PRIMARY KEY,           -- slug, e.g. "perth"
  name VARCHAR(100) NOT NULL UNIQUE,    -- display name, e.g. "Perth"
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
