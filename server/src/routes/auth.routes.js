const express = require('express');
const { register, login, getMe, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');

const router = express.Router();

router.post('/register', validateBody(['name', 'email', 'password']), register);
router.post('/login', validateBody(['email', 'password']), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
