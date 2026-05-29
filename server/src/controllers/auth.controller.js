const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });
  ApiResponse.created(result, 'Account created successfully').send(res);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  ApiResponse.success(result, 'Logged in successfully').send(res);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);
  ApiResponse.success(user, 'User profile retrieved').send(res);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateUserProfile(req.user._id, req.body);
  ApiResponse.success(user, 'Profile updated successfully').send(res);
});

module.exports = { register, login, getMe, updateProfile };
