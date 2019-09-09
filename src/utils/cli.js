const clc = require('cli-color');

const info = (content) => {
  console.log(`${clc.green('info:')} ${content}`);
};

const error = (content) => {
  console.log();
  info(content);
  console.log();
  process.exit(1);
};

module.exports = {
  info,
  error,
};
