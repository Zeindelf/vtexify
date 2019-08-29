/* eslint-disable */
const { prompt } = require('inquirer');
const Ora = require('ora');
const clc = require('cli-color');
const glob = require('glob');
const { resolve } = require('path');
const normalize = require('normalize-path');

const vtexCMS = require('./VtexCMS');

module.exports = async () => {
  const { type, files, confirm } = await prompt([
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
      type: 'input',
      name: 'files',
      message: 'Files to upload (can use glob pattern)',
      validate: (val) => (val.length ? true : 'Please enter a valid file name'),
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Selected files',
      when: (answers) => {
        // const dir = normalize(resolve(process.cwd(), answers.files));
        const dir = resolve(process.cwd(), answers.files);
        const _files = glob.sync(dir);
        console.log(_files);
        console.log(process.cwd());
        console.log(answers.files);
        return true;
      },
    },
  ]);

  console.log(confirm);
};
