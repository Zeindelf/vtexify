#!/usr/bin/env node

const program = require('commander');
const updateNotifier = require('update-notifier');

const pkg = require('../package.json');
const login = require('../src/login');

const { version, description } = pkg;

updateNotifier({ pkg }).notify();

program
  .description(description)
  .version(version, '-v, --version', 'output the current version');

program
  .command('login')
  .description('Auth user to get VTEX-Auth-Cookies')
  .action(login);

program.parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
}
