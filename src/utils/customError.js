/**
 * @fileoverview Custom operational error utility class.
 * @module utils/customError
 * @extends Error
 */

/**
 * Class representing an operational system error.
 * Used to normalize error structures across the entire Express lifecycle.
 */
class CustomError extends Error {
    /**
     * Create a custom operational error.
     * @param {string} message - The error diagnostic message.
     * @param {number} statusCode - The HTTP status code representation.
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        
        // Fail represents 4xx client issues; error represents 5xx runtime drops
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        // Flags this issue as operational so our global handler catches it safely
        this.isOperational = true;

        // Captures clean v8 stack traces for debugging logs
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;