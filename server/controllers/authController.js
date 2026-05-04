const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
} = require('../utils/generateToken');

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Create the user — password gets hashed automatically by our pre-save hook
    const user = await User.create({ name, email, password });

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to DB (so we can invalidate it on logout)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Send refresh token as httpOnly cookie
    sendRefreshToken(res, refreshToken);

    // Send access token in response body
    res.status(201).json({
      message: 'Account created successfully',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    // We need the password for comparison, so we explicitly select it
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Update last login time
    user.lastLogin = new Date();

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendRefreshToken(res, refreshToken);

    res.json({
      message: 'Logged in successfully',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GUEST LOGIN ──────────────────────────────────────────────────────────────
exports.guestLogin = async (req, res, next) => {
  try {
    // Generate a temporary guest token — no DB record needed
    // Guest token has a short expiry and limited role
    const guestToken = generateAccessToken('guest_' + Date.now(), 'guest');

    res.json({
      message: 'Continuing as guest',
      accessToken: guestToken,
      user: {
        id: null,
        name: 'Guest',
        email: null,
        role: 'guest',
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
// Called silently by the frontend when the access token expires
exports.refreshToken = async (req, res, next) => {
  try {
    // Read the httpOnly cookie
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'No refresh token.' });
    }

    // Verify it
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Find the user and make sure the token matches what we stored
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ error: 'Invalid refresh token.' });
    }

    // Issue a new access token
    const newAccessToken = generateAccessToken(user._id, user.role);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token expired. Please log in again.' });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
exports.logout = async (req, res, next) => {
  try {
    // Clear the refresh token from DB
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }

    // Clear the cookie
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      savedRecipes: req.user.savedRecipes,
      personalPantry: req.user.personalPantry,
    },
  });
};