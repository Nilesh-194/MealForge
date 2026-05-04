const jwt = require('jsonwebtoken');

// Creates a short-lived access token (15 minutes)
// Sent in the response body, stored in memory on the frontend
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Creates a long-lived refresh token (7 days)
// Stored in an httpOnly cookie — JavaScript cannot access it
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

// Sends the refresh token as a secure cookie
// httpOnly = JS can't read it (XSS protection)
// secure = only sent over HTTPS in production
// sameSite = CSRF protection
const sendRefreshToken = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

module.exports = { generateAccessToken, generateRefreshToken, sendRefreshToken };