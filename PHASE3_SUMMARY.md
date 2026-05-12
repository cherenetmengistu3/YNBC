# ExpenseIQ Phase 3: Financial Module Documentation

## 1. How Company Isolation Works (Multi-Tenancy)
Security and data isolation are handled at the **Service Layer**:
- **JWT Protection**: Every request must include a valid JWT. The `verifyToken` middleware extracts the `company_id` from the token.
- **Strict Query Filtering**: Every SQL query in the financial services (Expenses, Income, Dashboard) includes a `WHERE company_id = ?` clause. 
- **User Verification**: Even if a user knows an Expense ID, they cannot view or delete it if it belongs to another company, because our queries always validate both the `id` and the `company_id`.

## 2. Financial Warning Logic
The "Financial Health" system (`/api/dashboard/financial-health`) works as follows:
- It calculates the total **Income** and **Expenses** for the **current calendar month**.
- **Logic**: If `Total Monthly Expenses > Total Monthly Income`, the system flags a risk.
- **Output**: Returns `warning: true` with a descriptive message to alert the company of deficit spending.

## 3. API Examples & Postman Setup

### A. Expense Management
- **POST** `/api/expenses`
  - Body: `{"title": "Office Rent", "amount": 1200, "category": "Bills", "payment_method": "Bank", "expense_date": "2023-10-01"}`
- **GET** `/api/expenses?page=1&limit=10`
  - Returns paginated list of company expenses.
- **DELETE** `/api/expenses/:id`
  - Deletes an expense (if it belongs to your company).

### B. Income Management
- **POST** `/api/income`
  - Body: `{"source_name": "Product Sale", "amount": 5000, "income_date": "2023-10-05"}`
- **GET** `/api/income?page=1&limit=5`
  - Returns paginated income records.

### C. Dashboard
- **GET** `/api/dashboard/summary`
  - Returns: Total Income, Total Expenses, Net Balance, and 5 Latest Transactions.
- **GET** `/api/dashboard/financial-health`
  - Returns: Warning status if spending exceeds monthly revenue.

## 4. Testing Instructions
1. **Apply Database Changes**: Execute the SQL in `database/financial_schema.sql`.
2. **Restart Server**: Run `npm run dev`.
3. **Authentication**: Login first to get your JWT token.
4. **Header**: In all requests, add `Authorization: Bearer <YOUR_TOKEN>`.
5. **Flow**: Create a company -> Create an admin user for it -> Log in -> Start adding income and expenses.
