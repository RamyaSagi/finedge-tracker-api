/**
 * @fileoverview Database domain engine executing user workflows via Mongoose.
 * @module services/userService
 */
const User = require('../models/userModel');
const CustomError = require('../utils/customError');

/**
 * Validates, normalizes, and registers a brand new user profile document within MongoDB.
 */
exports.registerUser = async (userData) => {
    try {
        const { password, fullName } = userData;
        let { email } = userData;

        if (!email || !password || !fullName) {
            throw new CustomError("Missing user registration credentials. Full name, email, and password are required.", 400);
        }

        email = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError("Email profile already registered under this system.", 409);
        }

        const newUser = await User.create({
            fullName,
            email,
            password
        });

        const userObj = newUser.toObject();
        delete userObj.password;
        delete userObj.__v;

        return userObj;
        
    } catch (err) {
        // ✅ FIX: Throw the error upward instead of trying to invoke next(err)
        throw err; 
    }
};

/**
 * Validates a user's login credentials against saved database records.
 */
exports.loginUser = async (loginData) => {
    try {
        let { email, password } = loginData;

        if (!email || !password) {
            throw new CustomError("Please provide both email and password parameters to login.", 400);
        }

        email = email.toLowerCase().trim();

        const profile = await User.findOne({ email }).select('+password');
        
        if (!profile || !(await profile.correctPassword(password, profile.password))) {
            throw new CustomError("Invalid authentication credentials provided. Access Denied.", 401);
        }

        const userObj = profile.toObject();
        delete userObj.password;
        delete userObj.__v;

        return userObj;

    } catch (err) {
        // ✅ FIX: Throw the error upward instead of trying to invoke next(err)
        throw err;
    }
};