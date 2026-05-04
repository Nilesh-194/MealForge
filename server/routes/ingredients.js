const express = require('express');
const router  = express.Router();
const {
  searchIngredients,
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} = require('../controllers/ingredientController');
const { protect } = require('../middleware/auth');
const adminOnly   = require('../middleware/adminOnly');

// Public
router.get('/search', searchIngredients);
router.get('/',       getAllIngredients);

// Admin only
router.post('/',      protect, adminOnly, createIngredient);
router.put('/:id',   protect, adminOnly, updateIngredient);
router.delete('/:id', protect, adminOnly, deleteIngredient);

module.exports = router;