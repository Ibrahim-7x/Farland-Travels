CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT NOT NULL,
  source ENUM('manual','google') DEFAULT 'manual',
  is_sample TINYINT(1) DEFAULT 0,
  is_published TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
