const express = require('express');
const { getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addContribution } = require('../controllers/savings.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSavingsGoals)
  .post(validateBody(['name', 'targetAmount']), createSavingsGoal);

router.post('/:id/contribute', validateBody(['amount']), addContribution);

router.route('/:id')
  .put(updateSavingsGoal)
  .delete(deleteSavingsGoal);

module.exports = router;
