const Budget = require('../models/Budget.model');
const Expense = require('../models/Expense.model');
const ApiError = require('../utils/ApiError');

const getBudgets = async (userId, query = {}) => {
  const now = new Date();
  const month = parseInt(query.month) || now.getMonth() + 1;
  const year = parseInt(query.year) || now.getFullYear();

  const budgets = await Budget.find({ userId, month, year })
    .populate('categoryId', 'name icon color')
    .sort({ name: 1 });

  return { budgets, month, year };
};

const createBudget = async (userId, data) => {
  const now = new Date();
  const month = data.month || now.getMonth() + 1;
  const year = data.year || now.getFullYear();

  // Calculate current spent for this category/month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const expenseAgg = await Expense.aggregate([
    {
      $match: {
        userId: require('mongoose').Types.ObjectId.createFromHexString(userId.toString()),
        categoryId: require('mongoose').Types.ObjectId.createFromHexString(data.categoryId.toString()),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const spent = expenseAgg.length > 0 ? expenseAgg[0].total : 0;

  const budget = await Budget.create({
    ...data,
    userId,
    month,
    year,
    spent,
  });

  return budget.populate('categoryId', 'name icon color');
};

const updateBudget = async (userId, budgetId, data) => {
  const allowedUpdates = ['name', 'limit', 'period'];
  const filteredData = {};
  allowedUpdates.forEach((field) => {
    if (data[field] !== undefined) filteredData[field] = data[field];
  });

  const budget = await Budget.findOneAndUpdate(
    { _id: budgetId, userId },
    filteredData,
    { new: true, runValidators: true }
  ).populate('categoryId', 'name icon color');

  if (!budget) {
    throw ApiError.notFound('Budget not found');
  }

  return budget;
};

const deleteBudget = async (userId, budgetId) => {
  const budget = await Budget.findOneAndDelete({ _id: budgetId, userId });
  if (!budget) {
    throw ApiError.notFound('Budget not found');
  }
  return budget;
};

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
