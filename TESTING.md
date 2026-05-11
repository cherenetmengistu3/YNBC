# ExpenseIQ Testing Guide

This guide provides instructions and example requests to test the authentication and admin systems.

## 1. Setup
- Ensure MySQL is running.
- Run `database/schema.sql` to reset the DB and create the default admin.
- Start the server: `npm run dev`

## 2. Default Credentials
- **Admin Email:** `admin@expenseiq.com`
- **Password:** `admin123`

---

## 3. Example API Requests

### A. Login (Public)
**POST** `http://localhost:3000/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "admin@expenseiq.com",
  "password": "admin123"
}
```
- **Response:** You will receive a `token`. **Copy this token** for the next steps.

### B. Create User (Admin Only)
**POST** `http://localhost:3000/api/admin/create-user`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
- **Body (JSON):**
```json
{
  "username": "jdoe",
  "email": "john@company.com",
  "password": "securePassword123",
  "company_id": 1,
  "role_id": 3,
  "status": "ACTIVE"
}
```

### C. List Users (Admin Only)
**GET** `http://localhost:3000/api/admin/users`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`

### D. Delete Own Account (Authenticated)
**DELETE** `http://localhost:3000/api/auth/delete-account`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`

---

## 4. Testing Authorization Rules
1. **No Token:** Try calling `/api/admin/users` without the Authorization header. It should return `401 Unauthorized`.
2. **Wrong Role:** Login as a non-admin user and try to call `/api/admin/create-user`. It should return `403 Forbidden`.
3. **Invalid Status:** Change a user's status to `DISABLED` in the database and try to log in. It should return an error.
