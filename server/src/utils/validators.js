const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRequired = (fields, body) => {
  const missing = fields.filter((field) => !body[field] && body[field] !== 0);
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  return null;
};

const validatePositiveNumber = (value, fieldName) => {
  if (typeof value !== 'number' || value < 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePositiveNumber,
};
