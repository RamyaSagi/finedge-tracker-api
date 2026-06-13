/**
 * @fileoverview Traffic interface handling HTTP user registration and session management.
 * @module controllers/userController
 */
const userService = require('../services/userService');
const mockJwt = require('../utils/mockJwt');

exports.register = async (req, res, next) => {
    console.log(next)
    try {
        const userProfile = await userService.registerUser(req.body);

        // ✅ FIX: Fallback to make sure we capture either _id or id safely
        const userId = userProfile._id || userProfile.id;

        // Sign the token with the verified identifier
        const token = mockJwt.sign({ id: userId });

        return res.status(201).json({
            status: "success",
            data: { 
                user: { 
                    id: userId,
                    fullName: userProfile.fullName,
                    email: userProfile.email,
                    token 
                } 
            }
        });
    } catch (err) {
        console.error("❌ Registration Pipeline Exception:", err);
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const userProfile = await userService.loginUser(req.body);

        // ✅ FIX: Fallback to make sure we capture either _id or id safely
        const userId = userProfile._id || userProfile.id;

        const token = mockJwt.sign({ id: userId });

        return res.status(200).json({
            status: "success",
            data: { 
                user: { 
                    id: userId,
                    fullName: userProfile.fullName,
                    email: userProfile.email,
                    token 
                } 
            }
        });
    } catch (err) {
        console.error("❌ Login Pipeline Exception:", err);
        next(err);
    }
};