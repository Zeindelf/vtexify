const inquirer = require('inquirer');
// const Ora = require('ora');
const clc = require('cli-color');

// const vtexCMS = require('./VtexCMS');
const { filesGlobMatch, getCurrentActive } = require('./utils/file');
const { validateDiff } = require('./utils/validate');
const { uploadQuestions } = require('./questions/upload');

inquirer.registerPrompt('path', require('inquirer-path').PathPrompt);

module.exports = async () => {
  const { type, files, confirm } = await inquirer.prompt(uploadQuestions);

  if (!confirm) {
    console.log();
    console.log(clc.red('Action cancelled'));
    console.log();
    process.exit(1);
  }

  const current = getCurrentActive();
  const validate = validateDiff(current.updatedAt);

  if (!validate) {
    console.log();
    console.log(`Session expired. Please login with ${clc.green('vtexify login')}`);
    console.log();
    process.exit(1);
  }

  // Process to upload
  console.log(clc.green('PASSED'), type, files, confirm);
  console.log(filesGlobMatch(files));
};
