CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 
  CREATE TABLE IF NOT EXISTS stores( 
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
  name VARCHAR(255) NOT NULL, 
  address VARCHAR(255) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 