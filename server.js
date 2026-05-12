// 1. MUST BE FIRST: Load environment variables from the .env file
require('dotenv').config();

// Import the express framework to handle HTTP requests
const express = require('express');
// Import the CORS middleware to allow cross-origin requests
const cors = require('cors');
// Import the custom logger for consistent server-side logging
const logger = require('./utils/logger');

// 2. Validate critical environment variables immediately to avoid runtime errors
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
// Iterate through each required variable name
requiredEnv.forEach(key => {
    // If the variable is not defined in the process environment
    if (!process.env[key]) {
        // Log a clear error message indicating what is missing
        console.error(`❌ MISSING ENV VAR: ${key}`);
        // Exit the process with failure code to prevent starting in a broken state
        process.exit(1);
    }
});

// Import existing Routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');

// --- PHASE 3: Import New Financial Module Routes ---
// Import routes for managing expenses
const expenseRoutes = require('./routes/expenseRoutes');
// Import routes for managing income
const incomeRoutes = require('./routes/incomeRoutes');
// Import routes for the financial dashboard and summary
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import the global centralized error handling middleware
const errorHandler = require('./middleware/errorMiddleware');

// Initialize the express application instance
const app = express();

// Global Middleware Setup
// Enable CORS with settings from environment (or default to allow all)
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
// Enable parsing of JSON request bodies
app.use(express.json());

// Route Mounting
// Mount health check routes
app.use('/api/health', healthRoutes);
// Mount authentication and account management routes
app.use('/api/auth', authRoutes);
// Mount admin management routes
app.use('/api/admin', adminRoutes);
// Mount company management routes
app.use('/api/companies', companyRoutes);

// --- PHASE 3: Mount Financial Module Routes ---
// Mount expense management routes
app.use('/api/expenses', expenseRoutes);
// Mount income management routes
app.use('/api/income', incomeRoutes);
// Mount dashboard and summary routes
app.use('/api/dashboard', dashboardRoutes);

// Define a simple base route to verify API availability
app.get('/', (req, res) => {
    // Return a success message in JSON format
    res.json({ message: "ExpenseIQ API is online and Phase 3 features are active" });
});

// Global Error Handler (Must be mounted last to catch all errors)
app.use(errorHandler);

// 3. Handle Port Configuration and Server Startup
// Define the port from environment variables or use 3000 as default
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming connections
const server = app.listen(PORT, () => {
    // Log that the server is successfully running
    logger.info(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
    // Check if the error is due to the port already being in use
    if (err.code === 'EADDRINUSE') {
        // Log a specific error message for port conflict
        console.error(`❌ Port ${PORT} is already in use. Please kill the process or use a different port.`);
    } else {
        // Log any other server startup errors
        console.error('❌ Server failed to start:', err);
    }
    // Exit the process with failure code
    process.exit(1);
});

// 4. Global Catch for Unhandled Promise Rejections
// This handles errors in asynchronous code that are not caught by try/catch blocks
process.on('unhandledRejection', (reason, promise) => {
    // Log the rejection reason and the promise that caused it
    console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});
