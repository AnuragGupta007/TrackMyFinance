const Expense = require('../models/Expense.model');
const Budget = require('../models/Budget.model');
const ApiError = require('../utils/ApiError');

const getExpenses = async (userId, query = {}) => {
  const { category, startDate, endDate, sort = '-date', page = 1, limit = 20 } = query;

  const filter = { userId };

  if (category) {
    filter.categoryId = category;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate('categoryId', 'name icon color')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Expense.countDocuments(filter),
  ]);

  return {
    expenses,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const createExpense = async (userId, data) => {
  const expense = await Expense.create({ ...data, userId });

  // Update budget spent amount if a budget exists for this category/month
  const expenseDate = new Date(data.date || Date.now());
  await Budget.findOneAndUpdate(
    {
      userId,
      categoryId: data.categoryId,
      month: expenseDate.getMonth() + 1,
      year: expenseDate.getFullYear(),
    },
    { $inc: { spent: data.amount } }
  );

  return expense.populate('categoryId', 'name icon color');
};

const updateExpense = async (userId, expenseId, data) => {
  const oldExpense = await Expense.findOne({ _id: expenseId, userId });
  if (!oldExpense) {
    throw ApiError.notFound('Expense not found');
  }

  // If amount changed, adjust budget
  if (data.amount !== undefined && data.amount !== oldExpense.amount) {
    const diff = data.amount - oldExpense.amount;
    const expenseDate = new Date(oldExpense.date);
    await Budget.findOneAndUpdate(
      {
        userId,
        categoryId: oldExpense.categoryId,
        month: expenseDate.getMonth() + 1,
        year: expenseDate.getFullYear(),
      },
      { $inc: { spent: diff } }
    );
  }

  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, userId },
    data,
    { new: true, runValidators: true }
  ).populate('categoryId', 'name icon color');

  return expense;
};

const deleteExpense = async (userId, expenseId) => {
  const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
  if (!expense) {
    throw ApiError.notFound('Expense not found');
  }

  // Subtract from budget
  const expenseDate = new Date(expense.date);
  await Budget.findOneAndUpdate(
    {
      userId,
      categoryId: expense.categoryId,
      month: expenseDate.getMonth() + 1,
      year: expenseDate.getFullYear(),
    },
    { $inc: { spent: -expense.amount } }
  );

  return expense;
};

const getExpenseSummary = async (userId, query = {}) => {
  const { month, year } = query;
  const now = new Date();
  const m = parseInt(month) || now.getMonth() + 1;
  const y = parseInt(year) || now.getFullYear();

  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 0, 23, 59, 59);

  const summary = await Expense.aggregate([
    {
      $match: {
        userId: require('mongoose').Types.ObjectId.createFromHexString(userId.toString()),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$categoryId',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        categoryId: '$_id',
        categoryName: '$category.name',
        categoryIcon: '$category.icon',
        categoryColor: '$category.color',
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  const totalExpenses = summary.reduce((acc, item) => acc + item.total, 0);

  return { summary, totalExpenses, month: m, year: y };
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseSummary };
