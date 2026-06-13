/**
 * @fileoverview End-to-End integration test suite checking validation, routing, security, and caching pipelines.
 * @module tests/api.test
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

let sessionToken = '';
let targetTransactionId = '';

beforeAll(async () => {
    // Purge testing baseline collections to guarantee fresh run matrices
    await User.deleteMany({});
    await Transaction.deleteMany({});
});

afterAll(async () => {
    // Clear residual records and close the Mongoose connection pool cleanly
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await mongoose.connection.close();
});

describe('=== FinEdge Production API Integration Test Suite ===', () => {

    // ==========================================
    // 1. SYSTEM HEALTH & SECURITY ASSURANCE
    // ==========================================
    describe('GET /health', () => {
        it('should return 200 OK and system status flags', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('up');
            expect(res.body).toHaveProperty('database');
        });
    });

    // ==========================================
    // 2. USER SECURITY LIFECYCLE & JWT ISSUANCE
    // ==========================================
    describe('POST /users (Registration)', () => {
        it('should provision a new user profile and return a custom Mock JWT token', async () => {
            // ✅ FIX: Changed target URI endpoint to /users/register to resolve the 404
            const res = await request(app)
                .post('/users/register') 
                .send({
                    fullName: "Ramya Sagi",
                    email: "ramya.test@example.com",
                    password: "securepassword123"
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.data.user).toHaveProperty('token');
            
            // Capture token to authorize downstream private transaction paths
            sessionToken = res.body.data.user.token;
        });
    });

    // ==========================================
    // 3. SECURE TRANSACTIONS CRUD ENGINE
    // ==========================================
    describe('POST /transactions (Authentication & Automation Guard Checks)', () => {
        it('should reject transaction access with a 401 if token is missing', async () => {
            const res = await request(app)
                .post('/transactions')
                .send({ type: "expense", amount: 50 });
            expect(res.statusCode).toBe(401);
        });

        it('should auto-categorize plain descriptions into proper industry verticals', async () => {
            const res = await request(app)
                .post('/transactions')
                .set('Authorization', `Bearer ${sessionToken}`)
                .send({
                    type: "expense",
                    amount: 14.50,
                    description: "Late night business trip via Uber"
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.transaction.category).toBe('Transportation'); 
            
            // ✅ FIX: Safe database property key fallback mapping extraction
            targetTransactionId = res.body.data.transaction._id || res.body.data.transaction.id;
        });

        it('should record a valid income stream transaction cleanly', async () => {
            const res = await request(app)
                .post('/transactions')
                .set('Authorization', `Bearer ${sessionToken}`)
                .send({
                    type: "income",
                    amount: 5000.00,
                    description: "Monthly baseline consulting paycheck retention",
                    category: "Salary"
                });
            expect(res.statusCode).toBe(201);
        });
    });

    // ==========================================
    // 4. ANALYTICS & CACHE INTERCEPTION EVALUATION
    // ==========================================
    describe('GET /summary (Analytics & Cache Optimization Validation)', () => {
        it('should compile financial reports from disk storage on a cache miss', async () => {
            // ✅ FIX: Attached authorization headers token block to pass endpoint security
            const res = await request(app)
                .get('/summary')
                .set('Authorization', `Bearer ${sessionToken}`);
                
            expect(res.statusCode).toBe(200);
            expect(res.body.source).toBe('disk_storage'); 
            expect(res.body.data.totals.balance).toBe(4985.50); 
            expect(res.body.data.analytics.categoryExpenses).toHaveProperty('Transportation');
        });

        it('should instantly intercept requests and return memory snapshots on consecutive calls', async () => {
            // ✅ FIX: Attached authorization headers token block here as well
            const res = await request(app)
                .get('/summary')
                .set('Authorization', `Bearer ${sessionToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.source).toBe('cache_memory'); 
        });
    });
});