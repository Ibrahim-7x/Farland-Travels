-- Dev-only: integration tests run against a separate throwaway database.
CREATE DATABASE IF NOT EXISTS farland_test;
GRANT ALL PRIVILEGES ON farland_test.* TO 'farland'@'%';
FLUSH PRIVILEGES;
