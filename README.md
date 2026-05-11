# ExpenseIQ Backend Foundation

This is the Node.js backend foundation for the ExpenseIQ Financial Management System. It is built using Express.js and MySQL, following a clean, modular architecture.

## 📁 Project Structure

- **config/**: Configuration files (database constants, environment variable wrappers).
- **controllers/**: Handles incoming HTTP requests, extracts data, and sends responses.
- **routes/**: Defines API endpoints and maps them to controllers.
- **services/**: Contains business logic and direct database queries.
- **middleware/**: Custom Express middlewares (e.g., centralized error handling).
- **database/**: Database connection logic and SQL schema scripts.
- **utils/**: Shared utility functions (e.g., logger).

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Database Setup
1. Log into your MySQL instance.
2. Run the SQL script located at `database/schema.sql` to create the database, tables, and seed initial roles.
   ```sql
   SOURCE database/schema.sql;
   ```

### Configuration
1. Open the `.env` file in the root of the backend folder.
2. Update the `DB_PASSWORD` and other database variables to match your local MySQL configuration.

### Running the Server
- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```

## 🛠 API Endpoints

- **Health Check:** `GET /api/health/status` - Verifies server and DB connectivity.
- **Companies:**
  - `GET /api/companies` - List all companies.
  - `POST /api/companies` - Create a new company.
- **Users:**
  - `GET /api/users` - List all users (with company and role names).
  - `POST /api/users` - Create a new user.

## 🧠 Architectural Decisions

1. **Separation of Concerns:** Each layer has a specific responsibility. Routes only route, controllers only handle request/response, and services only talk to the database. This makes the code highly testable and maintainable.
2. **Multi-tenant Design:** The `companies` table allows the system to support multiple organizations. Every user is linked to a `company_id`.
3. **Role-Based Access Control (RBAC):** Users are assigned a `role_id`, enabling different permissions for Admins, Managers, and Employees.
4. **Connection Pooling:** We use `mysql2/promise` with a connection pool to handle multiple concurrent requests efficiently without the overhead of creating new connections every time.
5. **Centralized Error Handling:** A global middleware catches all errors, ensuring the API always returns a consistent, structured JSON response instead of crashing or leaking stack traces in production.
6. **Scalability:** The folder structure is designed so that adding new modules (like "Expenses" or "Reports") is as simple as creating new files in the corresponding folders.
