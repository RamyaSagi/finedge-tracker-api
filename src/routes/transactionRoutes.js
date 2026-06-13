/**
 * @fileoverview Router mapping definitions for transactions resource management.
 * @module routes/transactionRoutes
 */
const express = require('express');
const txController = require('../controllers/transactionController');
const { validateTransaction } = require('../middleware/validator');
const protect = require('../middleware/auth'); // Mock JWT session protector

const router = express.Router();

// Apply session authentication universally to all transaction sub-paths
router.use(protect);

router.route('/')
    .post(validateTransaction, txController.create)
    .get(txController.fetchAll);

router.route('/:id')
    .get(txController.fetchOne)
    .patch(txController.update)
    .delete(txController.remove);

module.exports = router;