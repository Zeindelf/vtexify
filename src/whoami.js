const clc = require('cli-color');

const { read, authPath } = require('./utils/file');
const { diff, objectSearch, pad } = require('./utils/helpers');

const timeConvert = (num) => {
  const hours = Math.floor(num / 60);
  const minutes = Math.floor(num % 60);

  return `${pad(hours)}h${pad(minutes)}`;
};

module.exports = async () => {
  const authFile = read(authPath);
  const current = objectSearch(authFile, { active: true });

  if (!current) {
    console.log();
    console.log(clc.red('Not logged in'));
    process.exit(1);
  }

  const { account, email, updatedAt } = current;
  const expire = diff(updatedAt).minutes();
  const expireTime = (8 * 60) - expire;

  console.log();
  console.log(`Account: ${clc.green(account)}`);
  console.log(`User: ${clc.green(email)}`);
  console.log(`Expire in: ${expireTime > 0 ? clc.green(timeConvert(expireTime)) : clc.red('Expired, please login')}`);
};
