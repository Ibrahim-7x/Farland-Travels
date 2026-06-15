CREATE TABLE site_settings (
  `key` VARCHAR(100) PRIMARY KEY,
  value JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
