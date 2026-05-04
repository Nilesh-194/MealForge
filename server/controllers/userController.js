const User          = require('../models/User');
const Recipe        = require('../models/Recipe');
const SearchHistory = require('../models/SearchHistory');


// ─── GET USER PROFILE ─────────────────────────────────────────────────────────
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedRecipes');
    res.json(user);
  } catch (err) { next(err); }
};

// ─── SAVE A RECIPE ────────────────────────────────────────────────────────────
exports.saveRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedRecipes.includes(recipeId);
    if (alreadySaved) {
      // Unsave if already saved (toggle)
      user.savedRecipes = user.savedRecipes.filter(
        id => id.toString() !== recipeId
      );
      await user.save({ validateBeforeSave: false });
      return res.json({ message: 'Recipe removed from saved.', saved: false });
    }

    user.savedRecipes.push(recipeId);
    await user.save({ validateBeforeSave: false });

    // Increment saves count on recipe
    await Recipe.findByIdAndUpdate(recipeId, { $inc: { saves: 1 } });

    res.json({ message: 'Recipe saved!', saved: true });
  } catch (err) { next(err); }
};

// ─── GET SAVED RECIPES ────────────────────────────────────────────────────────
exports.getSavedRecipes = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedRecipes');
    res.json(user.savedRecipes);
  } catch (err) { next(err); }
};

// ─── GET SEARCH HISTORY ───────────────────────────────────────────────────────
exports.getHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) { next(err); }
};

// ─── DELETE HISTORY ITEM ──────────────────────────────────────────────────────
exports.deleteHistoryItem = async (req, res, next) => {
  try {
    await SearchHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
};

// ─── CLEAR ALL HISTORY ────────────────────────────────────────────────────────
exports.clearHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ user: req.user._id });
    res.json({ message: 'History cleared.' });
  } catch (err) { next(err); }
};

// ─── UPDATE PERSONAL PANTRY ───────────────────────────────────────────────────
exports.updatePantry = async (req, res, next) => {
  try {
    const { ingredients } = req.body; // array of ingredient names
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { personalPantry: ingredients },
      { new: true }
    );
    res.json({ personalPantry: user.personalPantry });
  } catch (err) { next(err); }
};

// ─── GET PERSONAL PANTRY ──────────────────────────────────────────────────────
exports.getPantry = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ personalPantry: user.personalPantry });
  } catch (err) { next(err); }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    );
    res.json({
      user: {
        id:   user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) { next(err); }
};

// ─── ADMIN: GET ALL USERS ─────────────────────────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;
    const total = await User.countDocuments();
    const users = await User.find()
      .select('-password -refreshToken')
      .skip(skip).limit(limit)
      .sort({ createdAt: -1 });
    res.json({ total, page, pages: Math.ceil(total / limit), users });
  } catch (err) { next(err); }
};

// ─── ADMIN: BAN / UNBAN USER ──────────────────────────────────────────────────
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ message: `User ${user.isActive ? 'activated' : 'banned'}.`, isActive: user.isActive });
  } catch (err) { next(err); }
};

// ─── ADMIN: CHANGE USER ROLE ──────────────────────────────────────────────────
exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.json({ message: 'Role updated.', user });
  } catch (err) { next(err); }
};
// ─── ADMIN: GET STATS ─────────────────────────────────────────────────────────
exports.getAdminStats = async (req, res, next) => {
  try {

    const [
      totalUsers,
      totalRecipes,
      totalSearches,
      recentUsers,
      recentSearches,
    ] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      SearchHistory.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt isActive'),
      SearchHistory.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    ]);

    res.json({
      stats: { totalUsers, totalRecipes, totalSearches },
      recentUsers,
      recentSearches,
    });
  } catch (err) { next(err); }
};