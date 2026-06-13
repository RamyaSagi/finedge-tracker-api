/**
 * @fileoverview Validation middleware intercepting transaction payloads.
 * @module middleware/validator
 */
const CustomError = require('../utils/customError');

exports.validateTransaction = (req, res, next) => {
    const { type, amount, category, description } = req.body;

    // 1. Enforce core financial parameters
    if (!type || !['income', 'expense'].includes(type)) {
        return next(new CustomError("Valid type parameters ('income' or 'expense') are required.", 400));
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return next(new CustomError("Valid positive transaction amount is required.", 400));
    }

    // 2. Updated Category Check: Allow missing category ONLY IF a description exists for automation
    const hasCategory = category && category.trim() !== '';
    const hasDescription = description && description.trim() !== '';

    if (!hasCategory && !hasDescription) {
        return next(new CustomError("Valid non-empty category title or descriptive keyword string is required.", 400));
    }

    // All validation parameters satisfied, hand off cleanly downstream
    next();
};