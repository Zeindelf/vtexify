const { prompt } = require('inquirer');
const Ora = require('ora');
const clc = require('cli-color');

const { loginQuestions, accessKeyQuestion } = require('./questions/login');
const { writeAuthFile, getCurrentActive } = require('./utils/file');
const { validateLogin } = require('./utils/validate');

const vtexId = require('./VtexId');

const success = (account, email) => console.log(`  Succesfully logged in ${clc.green.bold(account)} with user ${clc.green.bold(email)}`);
const spinner = new Ora({ color: 'yellow', indent: 2 });

module.exports = async () => {
  const current = getCurrentActive();
  const { account, email } = await prompt(loginQuestions);
  const validate = validateLogin(current, account, email);

  // TODO: Validate an existing AuthCookie in a AuthFile to avoid relogin
  if (current && validate) {
    console.log();
    success(account, email);
    console.log();
    process.exit(1);
  }

  vtexId.setAccount(account);
  const token = await vtexId.getToken();

  try {
    spinner.start();
    spinner.text = 'Sending email, please wait...';

    await vtexId.getAccessKey(token, email);
    spinner.succeed();
    console.log();
  } catch (err) {
    console.log(clc.red('Fail to send email. Please try again'));
    console.log();
    process.exit(1);
  }

  const { accessKey } = await prompt(accessKeyQuestion);

  try {
    spinner.start();
    spinner.text = 'Generate auth key, please wait...';

    const authCookie = await vtexId.validateToken(token, email, accessKey);
    spinner.succeed();

    writeAuthFile(account, email, token, authCookie);
    console.log();
  } catch (err) {
    console.log(clc.red('Fail to generate AuthCookie. Please try again'));
    console.log();
    process.exit(1);
  }

  success(account, email);
  console.log();
};
