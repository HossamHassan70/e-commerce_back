Begin;

-- ==================================================
-- USERS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL,
    phone_number VARCHAR(20),
    -- ADD ADMIN ROLE TO USER
    role VARCHAR(15) DEFAULT 'buyer' CHECK (role in ('buyer', 'seller', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

-- ==================================================
-- ADDRESS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS address (
    addressid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    street VARCHAR(100) NOT NULL,
    building_num VARCHAR(50),
    apt_num VARCHAR(50),
    postal_code VARCHAR(20)
);

-- ==================================================
-- CREDIT TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS credit (
    creditid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    card_num VARCHAR(50) UNIQUE NOT NULL,
    card_exp DATE NOT NULL,
    card_type VARCHAR(500) NOT NULL  
);

-- ==================================================
-- CATEGORY TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS category (
    categoryid SERIAL PRIMARY KEY,
    name VARCHAR(100)  
);

-- ==================================================
-- PRODUCT TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS product (
    productid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    categoryid INT REFERENCES category(categoryid) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    p_description TEXT,
    price numeric(10, 5) NOT NULL,
    stock INT,
    img TEXT[],
    availability_status VARCHAR(30) DEFAULT 'In stock' CHECK (availability_status in ('In stock', 'Out of stock')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    discount_percent NUMERIC(5,2) DEFAULT 0.0
);

-- ==================================================
-- REVIEWS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS review (
    reviewid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    productid INT REFERENCES product(productid) ON DELETE CASCADE,
    review TEXT,
    rating INT CHECK (rating BETWEEN 1 and 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- CART TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS cart (
    cartid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    productid INT REFERENCES product(productid) ON DELETE CASCADE,
    quantity INT DEFAULT 1
);

-- ==================================================
-- FAVLIST TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS favlist (
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    productid INT REFERENCES product(productid) ON DELETE CASCADE,
    PRIMARY KEY (userid, productid)
);

-- ==================================================
-- PAYMENT TABLE
-- ==================================================
-- CREATE TABLE IF NOT EXISTS payment (
--     paymentid SERIAL PRIMARY KEY,
--     userid INT REFERENCES users(userid) ON DELETE CASCADE,
--     orderid INT,
--     payment_status VARCHAR(50), --pending, delivered, cancelled
--     amount_paid NUMERIC(10,2)
-- );

-- ==================================================
-- ORDERS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS orders (
    orderid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    order_status VARCHAR(50), -- paid, refunded, failed
    total_amount NUMERIC(10,2),
    shipping_fee NUMERIC(10,2),
    -- ADD COL CREATED AT and UPDATED AT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONTACT US
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(100),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


-- ==================================================
-- END OF SCHEMA
-- ==================================================
COMMIT;