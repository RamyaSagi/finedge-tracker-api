/**
 * @fileoverview Database domain engine executing transactions workflows via Mongoose.
 * @module services/transactionService
 */
const Transaction = require('../models/transactionModel');
const aiHelper = require('../utils/aiHelper');
const analyticsUtil = require('../utils/analytics');
const cacheService = require('../services/cacheService');
const CustomError = require('../utils/customError');

exports.createTransaction = async (txData) => {
    // 🚀 Bonus Feature B: Fallback prediction if description exists but category is empty
    if ((!txData.category || txData.category.trim() === '') && txData.description) {
        txData.category = aiHelper.autoCategorize(txData.description);
    } else if (!txData.category) {
        txData.category = 'Miscellaneous';
    }

    const newTx = await Transaction.create(txData);
    cacheService.clear(); // Evict memory calculations on changes to avoid data drift
    return newTx;
};

exports.getAllTransactions = async () => {
    return await Transaction.find();
};

exports.getTransactionById = async (id) => {
    const tx = await Transaction.findById(id);
    if (!tx) throw new CustomError("Transaction matching that identifier was not found.", 404);
    return tx;
};

exports.updateTransaction = async (id, updateFields) => {
    const updatedTx = await Transaction.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true
    });
    if (!updatedTx) throw new CustomError("Transaction target not found.", 404);
    cacheService.clear(); // Reset stale data metrics
    return updatedTx;
};

exports.deleteTransaction = async (id) => {
    const deletedTx = await Transaction.findByIdAndDelete(id);
    if (!deletedTx) throw new CustomError("Transaction target not found.", 404);
    cacheService.clear(); // Reset stale data metrics
};

/**
 * Advanced aggregation engine computing category structures, trends, and saving suggestions.
 * @satisfies Bonus Features A & B
 */
exports.getAdvancedFinancialSummary = async () => {
    const txs = await Transaction.find();
    
    let totalIncome = 0;
    let totalExpenses = 0;

    txs.forEach(t => {
        if (t.type === 'income') totalIncome += t.amount;
        if (t.type === 'expense') totalExpenses += t.amount;
    });

    // Run advanced background analytical engines
    const categoryBreakdown = analyticsUtil.computeCategoryBreakdown(txs);
    const monthlyTrends = analyticsUtil.computeMonthlyTrends(txs);
    const automatedSavingTips = aiHelper.generateSavingTips(totalIncome, totalExpenses);

    return {
        totals: {
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses
        },
        analytics: {
            categoryExpenses: categoryBreakdown,
            historicalTrends: monthlyTrends
        },
        aiAutomation: {
            suggestedSavingTips: automatedSavingTips
        },
        computedAt: new Date().toISOString()
    };
};