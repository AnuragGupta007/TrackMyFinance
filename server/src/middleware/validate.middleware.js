const ApiError = require('../utils/ApiError');

/**
 * Middleware factory that validates request body fields.
 * @param {string[]} requiredFields - Array of required field names
 */
const validateBody = (requiredFields) => (req, res, next) => {
  const missing = requiredFields.filter(
    (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
  );

  if (missing.length > 0) {
    throw ApiError.badRequest(`Missing required fields: ${missing.join(', ')}`);
  }

  next();
};

module.exports = { validateBody };
