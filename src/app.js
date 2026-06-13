/**
 * @fileoverview Main entry point bootstrapping the complete FinEdge Personal Finance Tracker API.
 * @author Ramya Sagi
 * @version 2.0.0
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db'); 
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Modular Router Domain Imports
const userRoutes = require('./routes/userRoutes');
const txRoutes = require('./routes/transactionRoutes');
const transactionController = require('./controllers/transactionController');

// Initialize the Express core context framework instance
const app = express();

// ==========================================
// ADVANCED SECURITY MIDDLEWARES (Bonus Feature D)
// ==========================================

// 1. Cross-Origin Resource Sharing Layer Protection
app.use(cors());

// 2. Rate-Limiter: Keeps automated scrapers or scripts from flooding your database
const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute tracking window
    max: 100, // Caps connection requests to 100 per client IP address
    message: { status: "fail", message: "Too many requests sent from this address. Rate limit exceeded." }
});
app.use(globalRateLimiter);

// 3. Body Parsing and Request Logger tracking initialization
app.use(express.json());
app.use(logger);

// Establish connection setups cleanly to our MongoDB cluster instances
connectDB();

// ==========================================
// ENDPOINT MOUNTING
// ==========================================

/**
 * Health Check Verification Path
 */
app.get('/health', (req, res) => {
    return res.status(200).json({ 
        status: "up", 
        security_shield: "active", 
        database: "connected", 
        timestamp: new Date().toISOString() 
    });
});

// User Management Routes
app.use('/users', userRoutes);

// Transactions CRUD Processing Routes
app.use('/transactions', txRoutes);

// High-speed analytical computing summary calculations
app.get('/summary', transactionController.getSummary);

// Central Catch-All Error boundary interception layer middleware
app.use(errorHandler);

module.exports = app;