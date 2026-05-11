// 1. MUST BE FIRST: Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');

// 2. Validate critical environment variables immediately
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
requiredEnv.forEach(key => {
    if (!process.env[key]) {
        console.error(`❌ MISSING ENV VAR: ${key}`);
        process.exit(1); // Stop the server if config is missing
    }
});

// Import Routes & Middleware
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);

app.get('/', (req, res) => {
    res.json({ message: "ExpenseIQ API is online" });
});

// Global Error Handler (Must be last)
app.use(errorHandler);

// 3. Handle Port Conflicts & Startup
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please kill the process or use a different port.`);
    } else {
        console.error('❌ Server failed to start:', err);
    }
    process.exit(1);
});

// 4. Catch Unhandled Promise Rejections (e.g. Database connection issues)
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
    // Optional: Gracefully shutdown or keep running depending on criticality
});
