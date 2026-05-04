const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes        = require('./routes/auth');
const recipeRoutes      = require('./routes/recipes');
const ingredientRoutes  = require('./routes/ingredients');
const userRoutes        = require('./routes/users');
const aiRoutes          = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,        // Required to send/receive cookies cross-origin
}));

// ─── General Middleware ───────────────────────────────────────────────────────
app.use(morgan('dev'));          // Request logging
app.use(cookieParser());         // Parse cookies (for refresh token)
app.use(express.json());         // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/recipes',     recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/ai',          aiRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: '✅ Pantry API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Any error passed to next(error) ends up here
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join('. ') });
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `${field} already exists.` });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ─── Connect DB then start ────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
});