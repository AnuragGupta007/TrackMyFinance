const express = require('express');
const { getOverview, getTrends } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/trends', getTrends);

module.exports = router;
