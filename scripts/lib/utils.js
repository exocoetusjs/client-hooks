const addr = require('../config/addr');

const shell = require('shelljs');

const chalk = require('chalk');

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

function newline() {
  process.stdout.write('\n');
}

function logger_copy(file = '') {
  const colon = chalk.bold.blue('::');

  const backtick = chalk.bold.red('`');

  const copy = chalk.bold('copy');

  const filepath = chalk.bgBlack(file);

  console.log(`${colon} ${copy} ${backtick}${filepath}${backtick} ...`);
}

function copy_git_config() {
  if (shell.test('-f', './.gitconfig')) {
    shell.mv('./.gitconfig', './.gitconfig.bak');
  }

  logger_copy('.gitconfig');

  shell.exec(`curl -fsSL ${addr.gitconfig} > ./.gitconfig`);

  shell.exec(`git config --local include.path "../.gitconfig"`);
}

function copy_client_hooks_config() {
  if (shell.test('-f', './clienthooks.js')) {
    shell.mv('./clienthooks.js', './clienthooks.js.bak');
  }

  logger_copy('clienthooks.js');

  shell.exec(`curl -fsSL ${addr.hooksconfig} > ./clienthooks.js`);
}

module.exports = {
  copy: copy,
  newline: newline,
};
