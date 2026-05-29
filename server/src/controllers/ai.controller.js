const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const aiService = require('../services/ai.service');
const Category = require('../models/Category.model');

const getInsights = asyncHandler(async (req, res) => {
  const insights = await aiService.generateInsights(req.user._id);
  ApiResponse.success(insights, 'AI insights generated successfully').send(res);
});

const scanReceipt = asyncHandler(async (req, res) => {
  const { image, mimeType } = req.body;

  if (!image) {
    return res.status(400).json({
      success: false,
      message: 'No image data provided',
    });
  }

  // Get user's categories so AI can match against them
  const categories = await Category.find({ userId: req.user._id }).lean();

  const result = await aiService.parseReceipt(image, mimeType, categories);

  // If the AI found a category name, resolve it to the actual category ID
  if (result.category && !result.error) {
    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === result.category.toLowerCase()
    );
    if (matchedCategory) {
      result.categoryId = matchedCategory._id;
      result.categoryIcon = matchedCategory.icon;
      result.categoryColor = matchedCategory.color;
    }
  }

  ApiResponse.success(result, 'Receipt scanned successfully').send(res);
});

module.exports = { getInsights, scanReceipt };
