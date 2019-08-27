const jsonfile = require('jsonfile');
const mapValues = require('lodash/mapValues');
const fs = require('fs-extra');
const { resolve } = require('path');
const os = require('os');

const dir = resolve(os.homedir(), '.vtexify');
const authPath = resolve(dir, 'auth.json');
const write = (path, data) => jsonfile.writeFileSync(path, data, { spaces: 2 });
const read = (path) => jsonfile.readFileSync(path, { throws: false });

const writeAuthFile = async (path, file, account, email, authenticationToken, authCookie) => {
  const filteredFile = mapValues(file, (acc) => {
    acc.active = false;
    return acc;
  });

  const content = {
    ...filteredFile,
    [account]: {
      account,
      email,
      authenticationToken,
      authCookie,
      active: true,
      updatedAt: new Date(),
    },
  };

  fs.mkdirpSync(dir);
  write(path, content);
};

module.exports = {
  authPath,
  write,
  read,
  writeAuthFile,
};
