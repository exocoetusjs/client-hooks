'use strict';

const addr = require('../config/addr');

const exec = require('child_process').exec;

const semverRegex = require('semver-regex');

const inquirer = require('inquirer');

const download = require('download');

const semver = require('semver');

const shell = require('shelljs');

const chalk = require('chalk');

const path = require('path');

const fs = require('fs');

const co = require('co');

function newline() {
  process.stdout.write('\n');
}

function check(command = '') {
  if (command === 'git') {
    check_git();
  } else if (command === 'dir') {
    check_dir();
  } else if (command === 'node') {
    check_node();
  }
}

function make(filename = '') {
  if (filename === '.clienthooks') {
    make_client_hooks(filename);
  }
}

function copy(filename = '') {
  const result = co(function*() {
    if (filename === '.gitconfig') {
      return copy_git_config();
    } else if (filename === 'clienthooks.js') {
      return copy_client_hooks_config();
    }
  });
  return result;
}

function remove(filename = '') {
  switch (filename) {
    case '.gitconfig':
      remove_git_config();
      break;
    case 'clienthooks.js':
      remove_client_hooks_config();
      break;
    case '.clienthooks':
      remove_client_hooks_config_dir();
  }
}

function logger_operate(operate = '', filepath = '') {
  const colon = chalk.bold.blue('::');

  const oper = chalk.bold(operate);

  const file = chalk.bgBlack(filepath);

  console.log(`${colon} ${oper} ${file} ...`);
}

function get_config_answers(filename = '') {
  let answers = 'keep';

  if (shell.test('-f', `./${filename}`)) {
    answers = inquirer.prompt([{
      type: 'list',
      name: 'deal exist file',
      choices: ['remove', 'backup', 'keep'],
      message: `${filename} already exist, what you want to do?`,
    }])
  }
  return Promise.resolve(answers);
}

function get_environment_answers(filename = '') {
  let answers = 'clienthooks';

  if (shell.test('-f', `./${filename}`)) {
    answers = inquirer.prompt([{
      type: 'list',
      name: 'deal exist file',
      choices: ['clienthooks', 'serverhooks'],
      message: `select the operating environment?`,
    }])
  }
  return Promise.resolve(answers);
}

function deal_exist_file(filename = '') {
  const result = co(function *() {
    const bakname = `${filename}.bak`;

    let answers = yield get_config_answers(filename);

    answers = answers['deal exist file'];

    if (answers === 'remove') {
      return shell.rm(`./${filename}`);
    } else if (answers === 'backup') {
      return shell.mv(`./${filename}`, `./${bakname}`);
    } else if (answers === 'keep') {
      return 'keep';
    }
  });
  return result;
}

function make_client_hooks(filename = '') {
  const pwd = shell.pwd().toString();

  const filePath = path.join(pwd, filename);

  if (!shell.test('-d', filePath)) {
    logger_operate('make', `${filename}`);

    shell.mkdir('-p', filePath);
  }
}

function copy_git_config() {
  const result = co(function *() {
    const filename = '.gitconfig';

    const url = addr[filename];

    const result = yield deal_exist_file(filename);

    if (result !== 'keep') {
      logger_operate('copy', `${filename}`);

      const file =  yield download(url);

      fs.writeFileSync(`./${filename}`, file);
    }

    return shell.exec(`git config --local include.path "../${filename}"`);
  });
  return result;
}

function copy_client_hooks_config() {
  const result = co(function *() {
    const filename = 'clienthooks.js';

    const url = addr[filename];

    const result =  yield deal_exist_file(filename);

    if (result !== 'keep') {
      logger_operate('copy', `${filename}`);

      const file = yield download(url);

      fs.writeFileSync(`./${filename}`, file);
    }
  });
  return result;
}

function check_dir() {
  const check_dir = '[ -d .git ] || git rev-parse --git-dir > /dev/null 2>&1';

  const git = chalk.bgBlack('`git`');

  const error = chalk.red('ERR!');

  if (shell.exec(check_dir).code !== 0) {
    const message = `${error} current directory must be a ${git} repo.\n\n`;

    process.stderr.write(message);

    process.exit(1);
  }
}

function check_git() {
  let version = shell.exec('git --version');

  const error = chalk.red('ERR!');

  const level = '2.9.0';

  version = version.match(semverRegex())[0];

  if (!(semver.gte(version, level))) {
    const message = `${error} git must greater or equal than ${level}.\n\n`;

    process.stderr.write(message);

    process.exit(1);
  }
}

function check_node() {
  let version = shell.exec('node -v');

  const error = chalk.red('ERR!');

  const level = '6.3.1';

  version = version.match(semverRegex())[0];

  if (!(semver.gte(version, level))) {
    const message = `${error} node must greater or equal than ${level}.\n\n`;

    process.stderr.write(message);

    process.exit(1);
  }
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

function remove_client_hooks_config_dir() {
  const dirname = '.clienthooks';

  logger_operate('remove', `${dirname}`);

  if (shell.test('-d', `./${dirname}`)) {
    shell.rm('-rf', `./${dirname}`);
  }
}

module.exports = {
  make: make,
  copy: copy,
  check: check,
  remove: remove,
  newline: newline,
};
