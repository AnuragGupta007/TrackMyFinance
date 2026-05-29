const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCategories)
  .post(validateBody(['name']), createCategory);

router.route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
