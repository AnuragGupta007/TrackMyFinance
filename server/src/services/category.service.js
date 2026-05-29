const Category = require('../models/Category.model');
const ApiError = require('../utils/ApiError');

const getCategories = async (userId) => {
  return Category.find({ userId }).sort({ name: 1 });
};

const createCategory = async (userId, data) => {
  const existing = await Category.findOne({ userId, name: data.name });
  if (existing) {
    throw ApiError.conflict('Category with this name already exists');
  }
  return Category.create({ ...data, userId });
};

const updateCategory = async (userId, categoryId, data) => {
  const category = await Category.findOneAndUpdate(
    { _id: categoryId, userId },
    data,
    { new: true, runValidators: true }
  );
  if (!category) {
    throw ApiError.notFound('Category not found');
  }
  return category;
};

const deleteCategory = async (userId, categoryId) => {
  const category = await Category.findOneAndDelete({ _id: categoryId, userId });
  if (!category) {
    throw ApiError.notFound('Category not found');
  }
  return category;
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
