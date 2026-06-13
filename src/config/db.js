/**
 * @fileoverview MongoDB connection adapter configuration using Mongoose.
 * @module config/db
 */
const mongoose = require('mongoose');

/**
 * Mongo Connection Adapter
 * Establishes a connection to the MongoDB database using Mongoose.
 * If the connection fails, it logs the error and terminates the process.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected cleanly: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database connection dropped: ${error.message}`);
        process.exit(1); // Crash the process immediately if the database is unreachable
    }
};

module.exports = connectDB;