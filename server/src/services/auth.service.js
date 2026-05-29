const User = require('../models/User.model');
const Category = require('../models/Category.model');
const ApiError = require('../utils/ApiError');
const { validateEmail, validatePassword } = require('../utils/validators');

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#F59E0B', type: 'expense' },
  { name: 'Transport', icon: '🚗', color: '#3B82F6', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#8B5CF6', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#EC4899', type: 'expense' },
  { name: 'Bills & Utilities', icon: '💡', color: '#EF4444', type: 'expense' },
  { name: 'Health', icon: '🏥', color: '#10B981', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#06B6D4', type: 'expense' },
  { name: 'Travel', icon: '✈️', color: '#F97316', type: 'expense' },
  { name: 'Groceries', icon: '🛒', color: '#84CC16', type: 'expense' },
  { name: 'Other', icon: '📦', color: '#64748B', type: 'expense' },
];

const registerUser = async ({ name, email, password }) => {
  if (!validateEmail(email)) {
    throw ApiError.badRequest('Please provide a valid email');
  }
  if (!validatePassword(password)) {
    throw ApiError.badRequest('Password must be at least 6 characters');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  const user = await User.create({ name, email, password });

  // Seed default categories for the new user
  const categories = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    userId: user._id,
  }));
  await Category.insertMany(categories);

  const token = user.generateToken();

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      currency: user.currency,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = user.generateToken();

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      currency: user.currency,
    },
    token,
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
};

const updateUserProfile = async (userId, updates) => {
  const allowedUpdates = ['name', 'avatar', 'currency'];
  const filteredUpdates = {};
  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
