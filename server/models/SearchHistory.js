const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ingredients: [String],
    resultCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SearchHistory', searchHistorySchema);