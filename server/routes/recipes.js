const express    = require('express');
const router     = express.Router();
const {
  getMatchingRecipes,
  getRecipeById,
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const { protect, optionalAuth } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// ⚠️ /search MUST come before /:id
router.get('/search', optionalAuth, getMatchingRecipes);
router.get('/all',    protect, adminOnly, getAllRecipes);
router.get('/:id',   getRecipeById);

router.post('/',      protect, adminOnly, createRecipe);
router.put('/:id',   protect, adminOnly, updateRecipe);
router.delete('/:id', protect, adminOnly, deleteRecipe);

module.exports = router;