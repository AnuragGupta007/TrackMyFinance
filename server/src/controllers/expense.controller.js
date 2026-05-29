const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const expenseService = require('../services/expense.service');

const getExpenses = asyncHandler(async (req, res) => {
  const result = await expenseService.getExpenses(req.user._id, req.query);
  ApiResponse.success(result, 'Expenses retrieved').send(res);
});

const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.user._id, req.body);
  ApiResponse.created(expense, 'Expense added').send(res);
});

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.user._id, req.params.id, req.body);
  ApiResponse.success(expense, 'Expense updated').send(res);
});

const deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.user._id, req.params.id);
  ApiResponse.noContent('Expense deleted').send(res);
});

const getExpenseSummary = asyncHandler(async (req, res) => {
  const summary = await expenseService.getExpenseSummary(req.user._id, req.query);
  ApiResponse.success(summary, 'Expense summary retrieved').send(res);
});

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseSummary };
