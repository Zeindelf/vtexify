const Table = require('cli-table');

/**
 * Format a file data into an Table for CLI
 * @param {Array} files An Array of Arrays with Filename|Filesize
 */
const createFileTable = (files) => {
  const table = new Table({
    head: ['File', 'Size'],
    style: {
      head: ['green'],
    },
  });

  table.push(...files);

  return table.toString();
};

module.exports = {
  createFileTable,
};
