const clc = require('cli-color');

const { read, authPath } = require('./utils/file');
const { diff, objectSearch, time } = require('./utils/helpers');

module.exports = async () => {
  const authFile = read(authPath);
  const current = objectSearch(authFile, { active: true });

  if (!current) {
    console.log();
    console.log(clc.red('Not logged in'));
    process.exit(1);
  }

  const { account, email, updatedAt } = current;
  const expireTime = (process.env.EXPIRE_TIME) - diff(updatedAt);

  console.log();
  console.log(`Account: ${clc.green(account)}`);
  console.log(`User: ${clc.green(email)}`);
  console.log(`Expire in: ${expireTime > 0 ? clc.green(time(expireTime)) : clc.red('Expired, please login')}`);
};
