/**
 * @fileoverview Traffic interface handling HTTP transactions streams.
 * @module controllers/transactionController
 */
const txService = require('../services/transactionService');
const cacheService = require('../services/cacheService');

exports.create = async (req, res, next) => {
    try {
        const tx = await txService.createTransaction(req.body);
        return res.status(201).json({ status: "success", data: { transaction: tx } });
    } catch (err) { next(err); }
};

exports.fetchAll = async (req, res, next) => {
    try {
        const txs = await txService.getAllTransactions();
        return res.status(200).json({ status: "success", results: txs.length, data: { transactions: txs } });
    } catch (err) { next(err); }
};

exports.fetchOne = async (req, res, next) => {
    try {
        const tx = await txService.getTransactionById(req.params.id);
        return res.status(200).json({ status: "success", data: { transaction: tx } });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        const updatedTx = await txService.updateTransaction(req.params.id, req.body);
        return res.status(200).json({ status: "success", data: { transaction: updatedTx } });
    } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
    try {
        await txService.deleteTransaction(req.params.id);
        return res.status(204).json({ status: "success", data: null });
    } catch (err) { next(err); }
};

/**
 * Handles analytics calculation requests backed by our high-performance in-memory TTL caching layer.
 * @satisfies Bonus Feature D (Cache Layer)
 */
exports.getSummary = async (req, res, next) => {
    try {
        const cacheKey = 'global_financial_analytics_matrix';
        
        // 1. Check memory cache pool first
        const cachedData = cacheService.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                status: "success",
                source: "cache_memory",
                data: cachedData
            });
        }

        // 2. Cache Miss: Execute heavy calculation engines
        const comprehensiveSummary = await txService.getAdvancedFinancialSummary();
        
        // 3. Save to cache before shipping down the wire
        cacheService.set(cacheKey, comprehensiveSummary);

        return res.status(200).json({
            status: "success",
            source: "disk_storage",
            data: comprehensiveSummary
        });
    } catch (err) { next(err); }
};