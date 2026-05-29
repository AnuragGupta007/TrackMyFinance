const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [30, 'Category name cannot exceed 30 characters'],
    },
    icon: {
      type: String,
      default: '📁',
    },
    color: {
      type: String,
      default: '#64748B',
    },
    type: {
      type: String,
      enum: ['expense', 'income', 'both'],
      default: 'expense',
    },
  },
  { timestamps: true }
);

// Compound index for unique category name per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
