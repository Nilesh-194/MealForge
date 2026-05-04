const express   = require('express');
const router    = express.Router();
const { generateRecipe, chat, suggestRecipes } = require('../controllers/aiController');
const { protect }  = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

// All AI routes require login (not guest)
router.post('/generate',  protect, aiLimiter, generateRecipe);
router.post('/chat',      protect, aiLimiter, chat);
router.post('/suggest',   protect, aiLimiter, suggestRecipes);

module.exports = router;