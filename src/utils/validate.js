const { diff } = require('./helpers');

const validateDiff = (date) => diff(date) < process.env.EXPIRE_TIME;

const validateLogin = (current, account, email) => {
  if (!current) {
    return false;
  }

  return current.account === account
    && current.email === email
    && validateDiff(current.updatedAt);
};

module.exports = {
  validateDiff,
  validateLogin,
};
