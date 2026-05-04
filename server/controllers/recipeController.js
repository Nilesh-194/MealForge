const Recipe = require('../models/Recipe');
const SearchHistory = require('../models/SearchHistory');
const matchRecipes = require('../utils/matchRecipes');

// ─── GET MATCHING RECIPES ─────────────────────────────────────────────────────
// GET /api/recipes?ingredients=Eggs,Onion,Cheese&cuisine=French&difficulty=Easy
exports.getMatchingRecipes = async (req, res, next) => {
  try {
    const { ingredients, cuisine, difficulty, maxTime, tags } = req.query;

    if (!ingredients) {
      return res.status(400).json({ error: 'Please provide ingredients.' });
    }

    const userIngredients = ingredients
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    // Build optional filters
    const filter = { isApproved: true };
    if (cuisine)    filter.cuisine = cuisine;
    if (difficulty) filter.difficulty = difficulty;
    if (maxTime)    filter.timeMinutes = { $lte: Number(maxTime) };
    if (tags)       filter.tags = { $in: tags.split(',') };

    const allRecipes = await Recipe.find(filter);
    const matched = matchRecipes(userIngredients, allRecipes);

    // Save search to history if user is logged in
    if (req.user && req.user.role === 'user') {
      await SearchHistory.create({
        user: req.user._id,
        ingredients: userIngredients,
        resultCount: matched.length,
      });
    }

    res.json({
      count: matched.length,
      ingredients: userIngredients,
      results: matched,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE RECIPE ────────────────────────────────────────────────────────
// GET /api/recipes/:id
exports.getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL RECIPES (admin) ──────────────────────────────────────────────────
// GET /api/recipes/all
exports.getAllRecipes = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const total   = await Recipe.countDocuments();
    const recipes = await Recipe.find().skip(skip).limit(limit).sort({ createdAt: -1 });

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      recipes,
    });
  } catch (error) {
    next(error);
  }
};

// ─── CREATE RECIPE (admin) ────────────────────────────────────────────────────
// POST /api/recipes
exports.createRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE RECIPE (admin) ────────────────────────────────────────────────────
// PUT /api/recipes/:id
exports.updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE RECIPE (admin) ────────────────────────────────────────────────────
// DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.json({ message: 'Recipe deleted successfully.' });
  } catch (error) {
    next(error);
  }
};