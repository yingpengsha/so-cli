#!/usr/bin/env node

const program = require('commander');

program
  .version('0.0.1', '-v, --version')
  .usage('<command> [project-name]')
  .command('init', 'create a new project')
  .command('list', 'view template list')
  .parse(process.argv)