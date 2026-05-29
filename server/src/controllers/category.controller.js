const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const categoryService = require('../services/category.service');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories(req.user._id);
  ApiResponse.success(categories, 'Categories retrieved').send(res);
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.user._id, req.body);
  ApiResponse.created(category, 'Category created').send(res);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.user._id, req.params.id, req.body);
  ApiResponse.success(category, 'Category updated').send(res);
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.user._id, req.params.id);
  ApiResponse.noContent('Category deleted').send(res);
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
