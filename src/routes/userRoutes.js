/**
 * @fileoverview Router mapping definitions for user security access lifecycles.
 * @module routes/userRoutes
 */
const express = require('express');
// ──> Change this from userService to userController
const userController = require('../controllers/userController');

const router = express.Router();

// Public onboarding infrastructure endpoints
router.post('/register', userController.register); // 🚀 Calls the controller method
router.post('/login', userController.login);       // 🚀 Calls the controller method

module.exports = router;