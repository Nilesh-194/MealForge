const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware runs before any protected route handler
// It checks the Authorization header for a valid JWT
const protect = async (req, res, next) => {
  try {
    // JWT is sent as: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized. No token provided.' });
    }

    // Extract just the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verify the token — throws an error if expired or invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object
    // Any route handler after this can access req.user
    req.user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ error: 'User not found or deactivated.' });
    }

    next(); // Move on to the actual route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please refresh.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// Optional auth — attaches user if token exists, but doesn't block if not
// Used for routes that work for both logged-in and guest users
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch (error) {
    // Silently fail — guest users just don't get req.user
  }
  next();
};

module.exports = { protect, optionalAuth };