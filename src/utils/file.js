const jsonfile = require('jsonfile');
const mapValues = require('lodash/mapValues');
const fs = require('fs-extra');
const { resolve, basename } = require('path');
const os = require('os');
const normalize = require('normalize-path');
const glob = require('glob');
const filesize = require('filesize');

const { objectSearch } = require('./helpers');

/**
 * Create path on Users directory
 * @returns {String}
 */
const dir = resolve(os.homedir(), '.vtexify');

/**
 * Create full path for Auth JSON file
 * @return {String}
 */
const authPath = resolve(dir, 'auth.json');

/**
 * Write JSON files
 * @param {String} path Path to write
 * @param {Object} data Data to save
 */
const write = (path, data) => jsonfile.writeFileSync(path, data, { spaces: 2 });

/**
 * Read JSON files
 * @param {String} path Path to file for read
 */
const read = (path) => jsonfile.readFileSync(path, { throws: false });

/**
 * Matches files by a Glob pattern
 * @param {String} filesPath Path to files to match
 * @returns {Array} An Array of files path matched
 */
const filesGlobMatch = (filesPath) => {
  const directory = resolve(process.cwd(), normalize(filesPath));
  const options = {
    nodir: true,
  };

  return glob.sync(directory, options);
};

/**
 * Format an Array path files given into an Array of Filename and Filesize
 * Utility for formating table content
 * @param {Array} files Array with full path files
 */
const formatFiles = (files) => files.map((file) => ([
  basename(file),
  filesize(fs.statSync(file).size, { round: true }),
]));

/**
 * Writes a JSON Auth file
 * @param {String} account Store account name
 * @param {String} email User email
 * @param {String} authenticationToken AuthToken provided by VTEX
 * @param {String} authCookie AuthCookie necessary to every VTEX API Call
 */
const writeAuthFile = async (account, email, authenticationToken, authCookie) => {
  const authFile = read(authPath);

  // Sets all data to inactive
  const filtered = mapValues(authFile, (acc) => {
    acc.active = false;
    return acc;
  });

  const content = {
    ...filtered,
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
  write(authPath, content);
};

const getCurrentActive = () => {
  const authFile = read(authPath);

  return objectSearch(authFile, { active: true });
};

module.exports = {
  authPath,
  write,
  read,
  filesGlobMatch,
  formatFiles,
  writeAuthFile,
  getCurrentActive,
};
