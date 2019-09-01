const clc = require('cli-color');

const { filesGlobMatch, formatFiles } = require('../utils/file');
const { createFileTable } = require('../utils/tables');
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

exports.uploadQuestions = [
  {
    type: 'list',
    name: 'type',
    message: 'Select file type',
    choices: [
      { name: 'File (CSS/JS)', value: 'files' },
      { name: 'Template', value: 'templates' },
      { name: 'Sub Template', value: 'subTemplates' },
      { name: 'Shelf Template', value: 'shelves' },
    ],
  },
  {
    type: 'path',
    name: 'files',
    message: 'Files to upload (can use glob pattern)',
    default: process.cwd(),
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Are you sure to upload these files?',
    default: false,
    when: (answers) => {
      const filesMatch = filesGlobMatch(answers.files);

      if (!filesMatch.length) {
        console.log();
        console.log(clc.red('No files match the pattern'));
        console.log();
        process.exit(1);
      }

      console.log();
      console.log(createFileTable(formatFiles(filesMatch)));
      console.log();

      return true;
    },
  },
];
