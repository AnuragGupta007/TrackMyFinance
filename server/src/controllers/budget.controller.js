const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const budgetService = require('../services/budget.service');

const getBudgets = asyncHandler(async (req, res) => {
  const result = await budgetService.getBudgets(req.user._id, req.query);
  ApiResponse.success(result, 'Budgets retrieved').send(res);
});

const createBudget = asyncHandler(async (req, res) => {
  const budget = await budgetService.createBudget(req.user._id, req.body);
  ApiResponse.created(budget, 'Budget created').send(res);
});

const updateBudget = asyncHandler(async (req, res) => {
  const budget = await budgetService.updateBudget(req.user._id, req.params.id, req.body);
  ApiResponse.success(budget, 'Budget updated').send(res);
});

const deleteBudget = asyncHandler(async (req, res) => {
  await budgetService.deleteBudget(req.user._id, req.params.id);
  ApiResponse.noContent('Budget deleted').send(res);
});

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
