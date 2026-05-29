const Expense = require('../models/Expense.model');
const Budget = require('../models/Budget.model');
const SavingsGoal = require('../models/SavingsGoal.model');
const mongoose = require('mongoose');

const getOverview = async (userId) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
  const userObjId = mongoose.Types.ObjectId.createFromHexString(userId.toString());

  // Total expenses this month
  const [expenseAgg] = await Expense.aggregate([
    { $match: { userId: userObjId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  // Total savings
  const [savingsAgg] = await SavingsGoal.aggregate([
    { $match: { userId: userObjId } },
    {
      $group: {
        _id: null,
        totalSaved: { $sum: '$currentAmount' },
        totalTarget: { $sum: '$targetAmount' },
        activeGoals: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        completedGoals: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      },
    },
  ]);

  // Budgets this month
  const budgets = await Budget.find({ userId, month: currentMonth, year: currentYear })
    .populate('categoryId', 'name icon color');

  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalBudgetSpent = budgets.reduce((acc, b) => acc + b.spent, 0);

  // Recent transactions (last 5)
  const recentTransactions = await Expense.find({ userId })
    .populate('categoryId', 'name icon color')
    .sort({ date: -1 })
    .limit(5);

  return {
    expenses: {
      total: expenseAgg?.total || 0,
      count: expenseAgg?.count || 0,
    },
    savings: {
      totalSaved: savingsAgg?.totalSaved || 0,
      totalTarget: savingsAgg?.totalTarget || 0,
      activeGoals: savingsAgg?.activeGoals || 0,
      completedGoals: savingsAgg?.completedGoals || 0,
    },
    budgets: {
      totalLimit: totalBudgetLimit,
      totalSpent: totalBudgetSpent,
      items: budgets,
    },
    recentTransactions,
    month: currentMonth,
    year: currentYear,
  };
};

const getTrends = async (userId) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const userObjId = mongoose.Types.ObjectId.createFromHexString(userId.toString());

  // Monthly expense trends for last 6 months
  const expenseTrends = await Expense.aggregate([
    { $match: { userId: userObjId, date: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$date' }, year: { $year: '$date' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Monthly savings growth
  const savingsGoals = await SavingsGoal.find({ userId });
  const savingsGrowth = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthContributions = savingsGoals.reduce((acc, goal) => {
      const monthTotal = goal.contributions
        .filter((c) => {
          const cd = new Date(c.date);
          return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
        })
        .reduce((sum, c) => sum + c.amount, 0);
      return acc + monthTotal;
    }, 0);

    savingsGrowth.push({
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      total: monthContributions,
    });
  }

  // Format expense trends into consistent array
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedExpenses = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const found = expenseTrends.find((t) => t._id.month === m && t._id.year === y);
    formattedExpenses.push({
      month: m,
      year: y,
      label: monthNames[m - 1],
      total: found?.total || 0,
      count: found?.count || 0,
    });
  }

  return {
    expenses: formattedExpenses,
    savings: savingsGrowth.map((s, i) => ({
      ...s,
      label: monthNames[s.month - 1],
    })),
  };
};

module.exports = { getOverview, getTrends };
