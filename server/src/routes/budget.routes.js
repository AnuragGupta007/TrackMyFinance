const express = require('express');
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(validateBody(['name', 'categoryId', 'limit']), createBudget);

router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;
