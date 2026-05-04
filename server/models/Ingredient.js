const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    emoji:    { type: String, default: '🥄' },
    category: {
      type: String,
      enum: [
        'Protein',
        'Vegetable',
        'Fruit',
        'Dairy',
        'Grain',
        'Pantry',
        'Spice',
        'Herb',
        'Condiment',
        'Oil',
        'Beverage',
        'Nut',
        'Legume',
        'Seafood',
        'Other',
      ],
      default: 'Other',
    },
    aliases: [String],
  },
  { timestamps: true }
);

ingredientSchema.index({ name: 'text', aliases: 'text' });

module.exports = mongoose.model('Ingredient', ingredientSchema);