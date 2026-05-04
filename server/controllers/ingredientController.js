const Ingredient = require('../models/Ingredient');

// ─── SEARCH INGREDIENTS (autocomplete) ───────────────────────────────────────
// GET /api/ingredients/search?q=egg
exports.searchIngredients = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) return res.json([]);

    const ingredients = await Ingredient.find({
      $or: [
        { name:    { $regex: q, $options: 'i' } },
        { aliases: { $regex: q, $options: 'i' } },
      ],
    }).limit(8);

    res.json(ingredients);
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL INGREDIENTS ──────────────────────────────────────────────────────
// GET /api/ingredients
exports.getAllIngredients = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const ingredients = await Ingredient.find(filter).sort({ name: 1 });
    res.json(ingredients);
  } catch (error) {
    next(error);
  }
};

// ─── CREATE INGREDIENT (admin) ────────────────────────────────────────────────
exports.createIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE INGREDIENT (admin) ────────────────────────────────────────────────
exports.updateIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found.' });
    }
    res.json(ingredient);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE INGREDIENT (admin) ────────────────────────────────────────────────
exports.deleteIngredient = async (req, res, next) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ingredient deleted.' });
  } catch (error) {
    next(error);
  }
};