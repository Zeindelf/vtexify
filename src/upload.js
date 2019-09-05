const inquirer = require('inquirer');
const Ora = require('ora');
const clc = require('cli-color');

const { filesGlobMatch, getCurrentActive } = require('./utils/file');
const { validateDiff } = require('./utils/validate');
const { uploadQuestions } = require('./questions/upload');

const vtexCMS = require('./VtexCMS');

const spinner = new Ora({ color: 'yellow', indent: 2 });
const error = (content) => {
  console.log();
  console.log(content);
  console.log();
  process.exit(1);
};

inquirer.registerPrompt('path', require('inquirer-path').PathPrompt);

module.exports = async () => {
  const { type, files, confirm } = await inquirer.prompt(uploadQuestions);

  if (!confirm) {
    error(clc.red('Action cancelled'));
  }

  const current = getCurrentActive();
  const validate = validateDiff(current.updatedAt);
  const { account, authCookie } = current;

  if (!validate) {
    error(`Session expired. Please login with ${clc.green('vtexify login')}`);
  }

  // Process to upload
  vtexCMS.setAccount(account, authCookie);

  try {
    spinner.start();
    spinner.text = 'Generate token, please wait...';
    await vtexCMS.getRequestToken();
    spinner.succeed();
    console.log();
  } catch (err) {
    error(clc.red('Fail to generate Token. Please try again'));
  }

  if (type === 'templates') {
    try {
      spinner.start();
      spinner.text = 'Getting Template ID, please wait...';
      const template = await vtexCMS.getLegacyTemplateId('account', 'viewTemplate', false);
      spinner.succeed();

      console.log();
      console.log(template);
      console.log();
    } catch (err) {
      error(clc.red(err.message));
    }
  }

  if (type === 'files') {
    const filesMatch = filesGlobMatch(files);

    const request = filesMatch.map((fileMatch) => vtexCMS.saveFile(fileMatch));
    try {
      const responses = await Promise.all(request);

      console.log();
      responses.map(({ mensagem, fileNameInserted }) => console.log(`${mensagem} ${clc.green(fileNameInserted)}`));
      console.log();
    } catch (err) {
      error(clc.red(err));
    }
  }

  // console.log();
  // console.log('REQUEST_TOKEN', vtexCMS.requestToken);
  // console.log();
  // console.log(clc.green('PASSED'), type, files, confirm);
  // console.log(filesGlobMatch(files));
};
