const { diff } = require('./helpers');

const validateLogin = (current, account, email) => {
  if (!current) {
    return false;
  }

  return current.account === account
    && current.email === email
    && diff(current.updatedAt) < process.env.EXPIRE_TIME;
};

module.exports = {
  validateLogin,
};
