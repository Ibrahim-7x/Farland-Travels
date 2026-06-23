-- NOTE: stars / nights / makkah_nights / madinah_nights are VARCHAR (not INT)
-- because the source data holds descriptive strings such as "4 & 5 Star",
-- "5/4 Star", "10 nights" and "6 nights". Storing them verbatim keeps the
-- existing card/modal UI working unchanged and avoids inventing a numeric
-- normalisation that isn't in the data.
CREATE TABLE umrah_packages (
  id VARCHAR(50) PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  city VARCHAR(50) NOT NULL,
  stars VARCHAR(50) NOT NULL,
  nights VARCHAR(50) NOT NULL,
  room_type VARCHAR(50) NOT NULL,
  month VARCHAR(50),
  makkah_hotel VARCHAR(255),
  makkah_nights VARCHAR(50),
  makkah_rating DECIMAL(2,1),
  makkah_distance VARCHAR(100),
  madinah_hotel VARCHAR(255),
  madinah_nights VARCHAR(50),
  madinah_rating DECIMAL(2,1),
  madinah_distance VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  price_display VARCHAR(50),
  name VARCHAR(255),
  tier VARCHAR(50),
  departure_dates JSON,
  room_rates JSON,
  flight JSON,
  inclusions JSON,
  badge VARCHAR(100),
  most_popular TINYINT(1) DEFAULT 0,
  is_published TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
