const express = require('express');
const { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseSummary } = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');

const router = express.Router();

router.use(protect);

router.get('/summary', getExpenseSummary);

router.route('/')
  .get(getExpenses)
  .post(validateBody(['title', 'amount', 'categoryId']), createExpense);

router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
