const inquirer = require('inquirer');
// const Ora = require('ora');
const clc = require('cli-color');

// const vtexCMS = require('./VtexCMS');
const { filesGlobMatch } = require('./utils/file');
const { uploadQuestions } = require('./config/questions');

inquirer.registerPrompt('path', require('inquirer-path').PathPrompt);

module.exports = async () => {
  const { type, files, confirm } = await inquirer.prompt(uploadQuestions);

  if (!confirm) {
    console.log();
    console.log(clc.red('Action cancelled'));
    console.log();
    process.exit(1);
  }

  console.log(clc.green('PASSED'), type, files, confirm);
  console.log(filesGlobMatch(files));
};
