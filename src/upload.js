/* eslint-disable */
const inquirer = require('inquirer');
const Ora = require('ora');
const clc = require('cli-color');
const glob = require('glob');
const { resolve } = require('path');
const normalize = require('normalize-path');
const path = require('path');
const fs = require('fs-extra');
const filesize = require('filesize');
const columnify = require('columnify');

const vtexCMS = require('./VtexCMS');

inquirer.registerPrompt('path', require('inquirer-path').PathPrompt);

module.exports = async () => {
  const { type, files, confirm } = await inquirer.prompt([
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
      when: (answers) => {
        // const dir = normalize(resolve(process.cwd(), answers.files));
        const dir = resolve(process.cwd(), normalize(answers.files));
        const selected = glob.sync(dir);

        if (!selected.length) {
          return false;
        }

        // console.log('FILES', selected);
        // console.log('CURRENT_DIR', process.cwd());
        // console.log('ENTRY_PATH', answers.files);

        const filesObj = selected.map(select => ({
          filename: path.basename(select),
          filesize: filesize(fs.statSync(select).size),
        }));

        const columns = columnify(filesObj, {
          minWidth: 40,
          columnSplitter: ' | ',
          showHeaders: false,
        });

        console.log();
        console.log(columns);
        console.log();
        return true;
      },
    },
  ]);

  if (!confirm) {
    console.log(clc.red('Exit'));
    process.exit(1);
  }

  console.log(clc.green('PASSED'), confirm);
};
