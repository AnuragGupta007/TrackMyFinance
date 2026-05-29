const express = require('express');
const { getInsights, scanReceipt } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All AI routes require authentication
router.use(protect);

router.get('/insights', getInsights);
router.post('/scan-receipt', scanReceipt);

module.exports = router;
