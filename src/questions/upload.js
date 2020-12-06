const { filesGlobMatch, formatFiles } = require('../utils/file');
const { createFileTable } = require('../utils/tables');
const { error } = require('../utils/cli');

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
        error('No files match the pattern');
      }

      console.log();
      console.log(createFileTable(formatFiles(filesMatch)));
      console.log();

      return true;
    },
  },
];
