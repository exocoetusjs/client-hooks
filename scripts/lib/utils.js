'use strict';

const addr = require('../config/addr');

const inquirer = require('inquirer');

const download = require('download');

const shell = require('shelljs');

const chalk = require('chalk');

const fs = require('fs');

const co = require('co');

function newline() {
  process.stdout.write('\n');
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
  }
}

function logger_operate(operate = '', filepath = '') {
  const colon = chalk.bold.blue('::');

  const oper = chalk.bold(operate);

  const file = chalk.bgBlack(filepath);

  console.log(`${colon} ${oper} ${file} ...`);
}

function get_user_answers(filename = '') {
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

function deal_exist_file(filename = '') {
  const result = co(function *() {
    const bakname = `${filename}.bak`;

    const answers = yield get_user_answers(filename);

    if (answers === 'remove') {
      return shell.rm(`./${filename}`);
    } else if (answers === 'backup') {
      return shell.mv(`./${filename}`, `./${bakname}`);
    } else if (answers === 'keep') {
      return false;
    }
  });
  return result;
}

function copy_git_config() {
  const result = co(function *() {
    const filename = '.gitconfig';

    const url = addr[filename];

    yield deal_exist_file(filename);

    logger_operate('copy', `${filename}`);

    const file =  yield download(url);

    fs.writeFileSync(`./${filename}`, file);

    return shell.exec(`git config --local include.path "../${filename}"`);
  });
  return result;
}

function copy_client_hooks_config() {
  const result = co(function *() {
    const filename = 'clienthooks.js';

    const url = addr[filename];

    yield deal_exist_file(filename);

    logger_operate('copy', `${filename}`);

    const file = yield download(url);

    fs.writeFileSync(`./${filename}`, file);
  });
  return result;
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
