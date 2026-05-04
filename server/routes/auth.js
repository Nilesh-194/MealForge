const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  guestLogin,
  refreshToken,
  logout,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes (rate-limited)
router.post('/signup',  authLimiter, signup);
router.post('/login',   authLimiter, login);
router.post('/guest',   guestLogin);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me',      protect, getMe);

module.exports = router;