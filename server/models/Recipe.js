const mongoose = require('mongoose');

const recipeIngredientSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  amount:   { type: String, default: '' },
  optional: { type: Boolean, default: false },
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    emoji:      { type: String, default: '🍽️' },
    cuisine:    { type: String, trim: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    timeMinutes: { type: Number, default: 30 },
    servings:    { type: Number, default: 2 },
    calories:    { type: Number, default: 0 },
    ingredients: [recipeIngredientSchema],
    steps:       [String],
    tags:        [String],
    colorTheme:  { type: String, default: '' },
    rating:      { type: Number, default: 0, min: 0, max: 5 },
    saves:       { type: Number, default: 0 },
    isApproved:  { type: Boolean, default: true },
    isAIGenerated: { type: Boolean, default: false },
    createdBy:   {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Full text search index
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);