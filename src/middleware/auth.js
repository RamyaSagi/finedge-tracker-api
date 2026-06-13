const mockJwt = require('../utils/mockJwt');
const CustomError = require('../utils/customError');

// ❌ DO NOT DO THIS: exports.protect = (req, res, next) => { ... }
// ━► If you do, you have to import it as: const { protect } = require('./auth')

//  DO THIS (Default Export):
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new CustomError("Access denied. Token missing.", 401));
    }
    const token = authHeader.split(' ')[1];
    const decoded = mockJwt.verify(token);
    if (!decoded) return next(new CustomError("Authentication failed.", 401));
    
    req.user = decoded;
    next();
};