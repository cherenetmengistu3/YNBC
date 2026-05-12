-- Create the database if it does not already exist
CREATE DATABASE IF NOT EXISTS expense_iq_db;
-- Select the created database for subsequent operations
USE expense_iq_db;

-- Create companies table to support multi-tenant architecture
CREATE TABLE IF NOT EXISTS companies (
    -- Primary key with auto-increment
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Name of the company, cannot be null
    company_name VARCHAR(255) NOT NULL,
    -- Timestamp when the company record was created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table for Role-Based Access Control (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    -- Primary key with auto-increment
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Unique role name (e.g., ADMIN, ACCOUNTANT, EMPLOYEE)
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create users table with foreign key relationships
CREATE TABLE IF NOT EXISTS users (
    -- Primary key with auto-increment
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Foreign key to companies table
    company_id INT NOT NULL,
    -- Foreign key to roles table
    role_id INT NOT NULL,
    -- Unique username for identification
    username VARCHAR(100) NOT NULL UNIQUE,
    -- Unique email address for login
    email VARCHAR(255) NOT NULL UNIQUE,
    -- Field to store the hashed password (bcrypt)
    password_hash VARCHAR(255) NOT NULL,
    -- Current status of the user account
    status ENUM('ACTIVE', 'PENDING', 'DISABLED') DEFAULT 'PENDING',
    -- Timestamp of the user's last successful login
    last_login TIMESTAMP NULL,
    -- Timestamp when the user record was created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Timestamp updated automatically whenever the record changes
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Link user to company; if company is deleted, delete its users
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    -- Link user to a specific role
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Reset roles table to ensure consistency with requirements
DELETE FROM roles;
-- Seed the roles table with required system roles
INSERT INTO roles (role_name) VALUES ('ADMIN'), ('ACCOUNTANT'), ('EMPLOYEE');

-- Seed a sample company for testing purposes
INSERT INTO companies (company_name) VALUES ('ExpenseIQ Corp');

-- Seed a default Admin user (Password: admin123)
-- The hash below is generated using bcrypt with salt rounds of 10
INSERT INTO users (company_id, role_id, username, email, password_hash, status)
VALUES (1, 1, 'admin', 'admin@expenseiq.com', '$2a$10$X7vH0pX0vH0pX0vH0pX0vOu3.W8N5GvYk8.z/y9bC7b5Yk8.z/y9', 'ACTIVE');
