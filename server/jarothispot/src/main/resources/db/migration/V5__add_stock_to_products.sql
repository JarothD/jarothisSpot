-- Add stock column to products table
ALTER TABLE products 
ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;
