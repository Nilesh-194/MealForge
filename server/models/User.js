const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,               // No two users with the same email
      lowercase: true,            // Always store email in lowercase
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      // select: false means password is NEVER returned in queries by default
      // You have to explicitly ask for it with .select('+password')
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'guest', 'admin'],
      default: 'user',
    },
    savedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',            // Reference to Recipe model
      },
    ],
    personalPantry: [String],     // Ingredients the user always has
    isActive: {
      type: Boolean,
      default: true,              // Admin can deactivate users
    },
    lastLogin: Date,
    refreshToken: {
      type: String,
      select: false,              // Never expose refresh token in API responses
    },
  },
  {
    timestamps: true,             // Adds createdAt and updatedAt automatically
  }
);

// ─── MIDDLEWARE: Hash password before saving ──────────────────────────────────
// This runs automatically every time a user document is saved
userSchema.pre('save', async function (next) {
  // Only hash if the password field was actually changed
  // (prevents re-hashing on profile updates)
  if (!this.isModified('password')) return next();

  // Salt rounds = 12 means bcrypt runs 2^12 = 4096 iterations
  // Higher = more secure but slower. 12 is the industry sweet spot.
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── METHOD: Compare entered password with hashed password ───────────────────
// We add this as a method on the schema so we can call user.comparePassword()
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);