const { isEmail, isVtexCode } = require('../utils/helpers');

exports.loginQuestions = [
  {
    type: 'input',
    name: 'account',
    message: 'Enter the VTEX account',
    validate: (val) => (val.length ? true : 'Please enter a valid account name'),
  },
  {
    type: 'input',
    name: 'email',
    message: 'Enter your e-mail',
    validate: (val) => (isEmail(val) ? true : 'Please enter a valid e-mail'),
  },
];

exports.accessKeyQuestion = {
  type: 'input',
  name: 'accessKey',
  message: 'Enter the VTEX Access Token',
  validate: (val) => (isVtexCode(val) ? true : 'Please enter all 6 digits'),
};
