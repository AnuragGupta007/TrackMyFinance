const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const savingsService = require('../services/savings.service');

const getSavingsGoals = asyncHandler(async (req, res) => {
  const goals = await savingsService.getSavingsGoals(req.user._id);
  ApiResponse.success(goals, 'Savings goals retrieved').send(res);
});

const createSavingsGoal = asyncHandler(async (req, res) => {
  const goal = await savingsService.createSavingsGoal(req.user._id, req.body);
  ApiResponse.created(goal, 'Savings goal created').send(res);
});

const updateSavingsGoal = asyncHandler(async (req, res) => {
  const goal = await savingsService.updateSavingsGoal(req.user._id, req.params.id, req.body);
  ApiResponse.success(goal, 'Savings goal updated').send(res);
});

const deleteSavingsGoal = asyncHandler(async (req, res) => {
  await savingsService.deleteSavingsGoal(req.user._id, req.params.id);
  ApiResponse.noContent('Savings goal deleted').send(res);
});

const addContribution = asyncHandler(async (req, res) => {
  const goal = await savingsService.addContribution(req.user._id, req.params.id, req.body);
  ApiResponse.success(goal, 'Contribution added').send(res);
});

module.exports = { getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addContribution };
