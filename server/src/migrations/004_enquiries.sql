CREATE TABLE enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('holiday','umrah','quote') NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  payload JSON,
  source_page VARCHAR(255),
  status ENUM('new','contacted','closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
