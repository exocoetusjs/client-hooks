const addr = require('../config/addr');

const shell = require('shelljs');

const chalk = require('chalk');

function newline() {
  process.stdout.write('\n');
}

function copy(filename = '') {
  switch (filename) {
    case '.gitconfig':
      copy_git_config();
      break;
    case 'clienthooks.js':
      copy_client_hooks_config();
      break;
  }
}

function remove(filename = '') {
  switch (filename) {
    case '.gitconfig':
      remove_git_config();
      break;
    case 'clienthooks.js':
      remove_client_hooks_config();
      break;
  }
}

function logger_operate(operate = '', filepath = '') {
  const colon = chalk.bold.blue('::');

  const backtick = chalk.bold.red('`');

  const oper = chalk.bold(operate);

  const file = chalk.bgBlack(filepath);

  console.log(`${colon} ${oper} ${backtick}${file}${backtick} ...`);
}

function copy_git_config() {
  const filename = '.gitconfig';

  const bakname = `${filename}.bak`;

  if (shell.test('-f', `./${filename}`)) {
    shell.mv(`./${filename}`, `./${bakname}`);
  }

  logger_operate('copy', `${filename}`);

  shell.exec(`curl -fsSL ${addr.gitconfig} > ./${filename}`);

  shell.exec(`git config --local include.path "../${filename}"`);
}

function copy_client_hooks_config() {
  const filename = 'clienthooks.js';

  const bakname = `${filename}.bak`;

  if (shell.test('-f', `./${filename}`)) {
    shell.mv('./clienthooks.js', `./${filename}`);
  }

  logger_operate('copy', `${filename}`);

  shell.exec(`curl -fsSL ${addr.hooksconfig} > ./${filename}`);
}

function remove_git_config() {
  const filename = '.gitconfig';

  logger_operate('remove', `${filename}`);

  if (shell.test('-f', `./${filename}`)) {
    shell.rm(`./${filename}`);
  }

  shell.exec('git config --local --unset include.path');
}

function remove_client_hooks_config() {
  const filename = 'clienthooks.js';

  logger_operate('remove', `${filename}`);

  if (shell.test('-f', `./${filename}`)) {
    shell.rm(`./${filename}`);
  }
}

module.exports = {
  copy: copy,
  remove: remove,
  newline: newline,
};
