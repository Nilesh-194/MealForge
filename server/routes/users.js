const express = require('express');
const router  = express.Router();
const {
  getProfile,
  saveRecipe,
  getSavedRecipes,
  getHistory,
  deleteHistoryItem,
  clearHistory,
  updatePantry,
  getPantry,
  updateProfile,
  getAllUsers,
  getAdminStats,
  toggleUserStatus,
  changeUserRole,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const adminOnly   = require('../middleware/adminOnly');

// ── Profile ──────────────────────────────────────────────────────────────────
router.get('/profile',    protect, getProfile);
router.put('/profile',    protect, updateProfile);

// ── Saved Recipes ─────────────────────────────────────────────────────────────
router.get('/saved',               protect, getSavedRecipes);
router.post('/saved/:recipeId',    protect, saveRecipe);
router.delete('/saved/:recipeId',  protect, saveRecipe); // same fn = toggle

// ── Search History ────────────────────────────────────────────────────────────
router.get('/history',             protect, getHistory);
router.delete('/history',          protect, clearHistory);
router.delete('/history/:id',      protect, deleteHistoryItem);

// ── Personal Pantry ───────────────────────────────────────────────────────────
router.get('/pantry',   protect, getPantry);
router.put('/pantry',   protect, updatePantry);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get('/',                      protect, adminOnly, getAllUsers);
router.patch('/:id/status',          protect, adminOnly, toggleUserStatus);
router.patch('/:id/role',            protect, adminOnly, changeUserRole);
router.get('/stats', protect, adminOnly, getAdminStats);

module.exports = router;