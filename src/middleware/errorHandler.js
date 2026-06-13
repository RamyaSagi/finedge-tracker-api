/**
 * @fileoverview Global central catch-all error handling middleware.
 * @module middleware/errorHandler
 */

/**
 * Intercepts all rejected promises or next(err) invocations across the engine.
 */
module.exports = (err, req, res, next) => {
    // Fallback defaults to a internal server failure code if left blank
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Build standard structure to make responses fully predictable
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // Suppress developer callstacks in production to maintain server security
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};