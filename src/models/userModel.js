/**
 * @fileoverview Mongoose structural schema for User profile management.
 * @module models/userModel
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name attribute parameter is required.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Unique identity email index parameter is required.'],
        unique: true,
        lowercase: true, // Auto-normalizes variations like Alice@x.com to alice@x.com
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Secure password string parameters are required.'],
        minlength: [6, 'Password security strength must capture at least 6 characters.'],
        select: false // 🛡️ CRITICAL: Prevents password hash leaks by default in database queries!
    }
});

// Pre-save database hook: Automatic crypt hashing on new profile writes
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
});

/**
 * Custom schema instance compilation model utility checking login credentials.
 */
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);