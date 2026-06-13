/**
 * @fileoverview Mongoose structural schema for Transaction documents.
 * @module models/transactionModel
 */
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Type must be income or expense.'],
        enum: ['income', 'expense']
    },
    category: {
        type: String,
        required: [true, 'Category title is required.'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required.'],
        min: [0.01, 'Amount must be greater than zero.']
    },
    date: {
        type: Date,
        required: [true, 'A valid transaction date is required.'],
        default: Date.now
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt fields
});

module.exports = mongoose.model('Transaction', transactionSchema);