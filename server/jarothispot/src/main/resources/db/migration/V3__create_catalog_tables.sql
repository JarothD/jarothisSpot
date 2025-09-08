-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    CONSTRAINT uk_categories_name_type UNIQUE (name, type),
    CONSTRAINT chk_color_hex CHECK (color_hex ~ '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
);

-- Create products table with inheritance support
CREATE TABLE products (
    id UUID PRIMARY KEY,
    product_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT true
);

-- Create product_categories join table
CREATE TABLE product_categories (
    product_id UUID NOT NULL,
    category_id UUID NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_product_categories_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_categories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_categories_type ON categories(type);
