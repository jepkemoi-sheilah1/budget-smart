-- Create database schema for Budget Smart application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, category, month, year)
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_budgets_user_month_year ON budgets(user_id, month, year);

-- Insert admin user (email: admin@gmail.com, password: 12345)
-- Password hash for '12345' using SHA-256
INSERT OR IGNORE INTO users (username, email, password_hash) VALUES 
('admin', 'admin@gmail.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5');

-- Sample budgets for admin user
INSERT OR IGNORE INTO budgets (user_id, category, amount, month, year) VALUES 
(1, 'Housing', 1500.00, 12, 2024),
(1, 'Food', 600.00, 12, 2024),
(1, 'Transportation', 400.00, 12, 2024),
(1, 'Entertainment', 300.00, 12, 2024),
(1, 'Healthcare', 200.00, 12, 2024),
(1, 'Shopping', 250.00, 12, 2024);

-- Sample expenses for admin user
INSERT OR IGNORE INTO expenses (user_id, description, amount, category, date) VALUES 
(1, 'Monthly rent payment', 1500.00, 'Housing', '2024-12-01'),
(1, 'Grocery shopping at Walmart', 120.50, 'Food', '2024-12-02'),
(1, 'Gas station fill-up', 55.00, 'Transportation', '2024-12-03'),
(1, 'Netflix subscription', 15.99, 'Entertainment', '2024-12-04'),
(1, 'Dinner at Italian restaurant', 85.00, 'Food', '2024-12-05'),
(1, 'Uber ride to airport', 35.00, 'Transportation', '2024-12-06'),
(1, 'Movie tickets for two', 28.00, 'Entertainment', '2024-12-07'),
(1, 'Pharmacy prescription', 45.00, 'Healthcare', '2024-12-08'),
(1, 'Coffee shop', 12.50, 'Food', '2024-12-09'),
(1, 'Online shopping - clothes', 89.99, 'Shopping', '2024-12-10'),
(1, 'Electricity bill', 125.00, 'Housing', '2024-12-11'),
(1, 'Lunch with colleagues', 32.00, 'Food', '2024-12-12'),
(1, 'Spotify premium', 9.99, 'Entertainment', '2024-12-13'),
(1, 'Car maintenance', 150.00, 'Transportation', '2024-12-14'),
(1, 'Grocery shopping', 95.75, 'Food', '2024-12-15');
