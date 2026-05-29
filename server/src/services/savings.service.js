const SavingsGoal = require('../models/SavingsGoal.model');
const ApiError = require('../utils/ApiError');

const getSavingsGoals = async (userId) => {
  return SavingsGoal.find({ userId }).sort({ createdAt: -1 });
};

const createSavingsGoal = async (userId, data) => {
  return SavingsGoal.create({ ...data, userId });
};

const updateSavingsGoal = async (userId, goalId, data) => {
  const allowedUpdates = ['name', 'targetAmount', 'targetDate', 'status', 'color', 'icon'];
  const filteredData = {};
  allowedUpdates.forEach((field) => {
    if (data[field] !== undefined) filteredData[field] = data[field];
  });

  const goal = await SavingsGoal.findOneAndUpdate(
    { _id: goalId, userId },
    filteredData,
    { new: true, runValidators: true }
  );

  if (!goal) {
    throw ApiError.notFound('Savings goal not found');
  }

  return goal;
};

const deleteSavingsGoal = async (userId, goalId) => {
  const goal = await SavingsGoal.findOneAndDelete({ _id: goalId, userId });
  if (!goal) {
    throw ApiError.notFound('Savings goal not found');
  }
  return goal;
};

const addContribution = async (userId, goalId, { amount, note }) => {
  const goal = await SavingsGoal.findOne({ _id: goalId, userId });
  if (!goal) {
    throw ApiError.notFound('Savings goal not found');
  }

  if (goal.status === 'completed') {
    throw ApiError.badRequest('Goal is already completed');
  }

  goal.contributions.push({ amount, note, date: new Date() });
  goal.currentAmount += amount;

  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = 'completed';
  }

  await goal.save();
  return goal;
};

module.exports = { getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addContribution };
