const rateLimit = require('express-rate-limit');

// General API limiter — 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth routes — prevents brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // Only 10 login attempts per 15 minutes
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI routes — generous but controlled (Gemini free tier is 1500/day)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 20,                    // 20 AI requests per hour per IP
  message: { error: 'AI request limit reached. Try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, aiLimiter };