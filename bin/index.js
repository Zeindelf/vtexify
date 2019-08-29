#!/usr/bin/env node

require('dotenv').config();

const program = require('commander');
const updateNotifier = require('update-notifier');

const pkg = require('../package.json');

const whoami = require('../src/whoami');
const login = require('../src/login');
const download = require('../src/download');
const upload = require('../src/upload');

const { version, description } = pkg;

updateNotifier({ pkg }).notify();

program
  .description(description)
  .version(version, '-v, --version', 'output the current version');

program
  .command('whoami')
  .description('Check if user logged')
  .action(whoami);

program
  .command('login')
  .description('Auth user to get VTEX-Auth-Cookies')
  .action(login);

program
  .command('upload')
  .description('Upload VTEX files (HTML/CSS/JS)')
  .action(upload);

program
  .command('download')
  .description('Download full content from CMS (HTML/CSS/JS)')
  .action(download);

program.parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
}
