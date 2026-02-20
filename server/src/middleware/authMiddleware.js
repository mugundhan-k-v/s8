const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

        // req.user = decoded.user; // This only has basic info

        // Fetch full user to get permissions (teaches, classTeacherOf)
        const user = await User.findById(decoded.user.id).select('-passwordHash');

        if (!user) {
            return res.status(401).json({ msg: 'Token is valid, but user not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
