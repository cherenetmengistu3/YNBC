-- Switch to the ExpenseIQ database
USE expense_iq_db;

-- Create the expenses table to track company spending
CREATE TABLE IF NOT EXISTS expenses (
    -- Unique identifier for each expense record
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Reference to the company that owns this expense (Multi-tenancy)
    company_id INT NOT NULL,
    -- Short title or name of the expense
    title VARCHAR(255) NOT NULL,
    -- Detailed description of what the money was spent on
    description TEXT,
    -- Category of the expense (e.g., Food, Travel, Rent)
    category VARCHAR(100) NOT NULL,
    -- Numerical amount spent
    amount DECIMAL(15, 2) NOT NULL,
    -- Method used for payment (e.g., Cash, Credit Card, Bank Transfer)
    payment_method VARCHAR(100) NOT NULL,
    -- The actual date the expense occurred
    expense_date DATE NOT NULL,
    -- Reference to the user who recorded this expense
    created_by_user_id INT NOT NULL,
    -- Automatic timestamp for record creation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Link to the companies table, delete expenses if company is removed
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    -- Link to the users table, track who created the record
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    -- Index for fast filtering by company (Critical for isolation)
    INDEX idx_expense_company (company_id),
    -- Index for fast searching by date
    INDEX idx_expense_date (expense_date),
    -- Index for sorting latest records
    INDEX idx_expense_created (created_at)
);

-- Create the income table to track company revenue
CREATE TABLE IF NOT EXISTS income (
    -- Unique identifier for each income record
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Reference to the company that owns this income (Multi-tenancy)
    company_id INT NOT NULL,
    -- Name of the source (e.g., Client Payment, Investment)
    source_name VARCHAR(255) NOT NULL,
    -- Detailed description of the income source
    description TEXT,
    -- Numerical amount received
    amount DECIMAL(15, 2) NOT NULL,
    -- The actual date the income was received
    income_date DATE NOT NULL,
    -- Reference to the user who recorded this income
    created_by_user_id INT NOT NULL,
    -- Automatic timestamp for record creation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Link to the companies table
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    -- Link to the users table
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    -- Index for fast filtering by company
    INDEX idx_income_company (company_id),
    -- Index for fast searching by date
    INDEX idx_income_date (income_date),
    -- Index for sorting latest records
    INDEX idx_income_created (created_at)
);
