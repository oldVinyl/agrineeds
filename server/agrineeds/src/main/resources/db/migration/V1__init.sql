-- PRODUCTS
CREATE TABLE products (
                          id            BINARY(16) PRIMARY KEY,
                          sku           VARCHAR(64) UNIQUE,
                          name          VARCHAR(255) NOT NULL,
                          description   TEXT,
                          image_url     VARCHAR(1024),
                          category      VARCHAR(128),
                          price_cents   INT NOT NULL CHECK (price_cents >= 0),
                          stock         INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
                          is_active     TINYINT(1) NOT NULL DEFAULT 1,
                          created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ORDERS
CREATE TABLE orders (
                        id              BINARY(16) PRIMARY KEY,
                        status          VARCHAR(32) NOT NULL, -- PENDING, CONFIRMED, PACKED, EN_ROUTE, DELIVERED, CANCELLED
                        customer_name   VARCHAR(255) NOT NULL,
                        customer_phone  VARCHAR(64) NOT NULL,
                        note            TEXT,
                        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ORDER ITEMS
CREATE TABLE order_items (
                             id           BINARY(16) PRIMARY KEY,
                             order_id     BINARY(16) NOT NULL,
                             product_id   BINARY(16) NOT NULL,
                             name         VARCHAR(255) NOT NULL,     -- snapshot
                             price_cents  INT NOT NULL CHECK (price_cents >= 0), -- snapshot
                             qty          INT NOT NULL CHECK (qty > 0),
                             CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                             CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- USERS (admins only for now)
CREATE TABLE users (
                       id             BINARY(16) PRIMARY KEY,
                       username       VARCHAR(64) UNIQUE NOT NULL,
                       password_hash  VARCHAR(255) NOT NULL,
                       role           VARCHAR(32) NOT NULL DEFAULT 'ADMIN',
                       created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOG
CREATE TABLE audit_log (
                           id            BINARY(16) PRIMARY KEY,
                           actor_user_id BINARY(16),
                           action        VARCHAR(64) NOT NULL,
                           entity        VARCHAR(64) NOT NULL,
                           entity_id     BINARY(16),
                           payload       JSON,
                           created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- indexes
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_status   ON orders(status);
