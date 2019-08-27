const { prompt } = require('inquirer');
const Ora = require('ora');
const clc = require('cli-color');

const { loginQuestions, accessKeyQuestion } = require('./config/questions');
const { read, authPath, writeAuthFile } = require('./utils/file');
const { diff, objectSearch } = require('./utils/helpers');

const vtexId = require('./VtexId');

const success = (account, email) => console.log(`
  ${clc.green('✔')} Succesfully logged in ${clc.green.bold(account)} with user ${clc.green.bold(email)}
`);

module.exports = async () => {
  const authFile = read(authPath);
  const current = objectSearch(authFile, { active: true });
  const spinner = new Ora({ color: 'yellow', indent: 2 });
  const { account, email } = await prompt(loginQuestions);

  if (current) {
    const { account: currentAcc, updateAt } = current;

    if (currentAcc === account && diff(updateAt) < 8) {
      console.log();
      success(account, email);
      process.exit(1);
    }
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
    process.exit(1);
  }

  const { accessKey } = await prompt(accessKeyQuestion);

  try {
    spinner.start();
    spinner.text = 'Generate auth key, please wait...';

    const authCookie = await vtexId.validateToken(token, email, accessKey);
    spinner.succeed();

    writeAuthFile(authPath, authFile, account, email, token, authCookie);
    console.log();
  } catch (err) {
    console.log(clc.red('Fail to generate AuthCookie. Please try again'));
    process.exit(1);
  }

  success(account, email);
  console.log();
};
