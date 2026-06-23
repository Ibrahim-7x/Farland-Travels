-- Holiday deals / destinations — moved out of the frontend's static
-- destinations.ts so the whole listing (cards, detail pages, monthly pricing,
-- hotel components, highlights) is editable from the admin panel.
--
-- Simple scalar fields are columns; the repeating/nested sections (tags,
-- styles, meta_items, highlights, components, pricing, packages) are JSON,
-- mirroring the umrah_packages table. is_published + sort_order drive what
-- shows on the public site and in what order.
CREATE TABLE destinations (
  id VARCHAR(50) PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  region VARCHAR(255),
  region_label VARCHAR(255),
  image VARCHAR(500),
  hero_image VARCHAR(500),
  description TEXT,
  tagline VARCHAR(500),
  from_price VARCHAR(50),
  badge VARCHAR(100),
  rating VARCHAR(20),
  rating_text VARCHAR(100),
  tags JSON,
  styles JSON,
  meta_items JSON,
  highlights JSON,
  components JSON,
  pricing JSON,
  packages JSON,
  packages_note VARCHAR(500),
  transfers_included VARCHAR(255),
  is_published TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
