CREATE DATABASE IF NOT EXISTS cartvix_db;
USE cartvix_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    -- FEATURE: Account type — CUSTOMER (default, shops normally)
    -- or SELLER (can list/manage products like a seller dashboard).
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DOUBLE NOT NULL,
    description TEXT,
    image_url TEXT,
    -- FEATURE: Tracks which seller owns/listed this product.
    -- NULL for products added by the super-admin or seeded data.
    seller_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    shipping_address TEXT,
    payment_method VARCHAR(50),
    total_amount DOUBLE,
    -- FEATURE: current tracking stage. One of:
    -- PLACED, CONFIRMED, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED
    status VARCHAR(50) DEFAULT 'PLACED',
    -- FEATURE: when the status was last changed (shown on the tracking page)
    status_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- FEATURE: JSON array log of every stage change with its timestamp,
    -- e.g. [{"status":"PLACED","timestamp":"2026-08-21T10:00:00"}, ...]
    -- Powers the "straight line" tracker showing when each step happened.
    tracking_history TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);