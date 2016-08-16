'use strict';

const utils = require('./lib/utils');

const shell = require('shelljs');

const co = require('co');

shell.config.silent = true;

co(function *() {
  shell.cd('../../');

  //check logic
  utils.check('dir');

  utils.check('git');

  utils.check('node');

  // copy logic
  yield utils.copy('.gitconfig');

  yield utils.copy('clienthooks.js');

  // make logic
  utils.make('.clienthooks');

  // newline logic
  utils.newline();
});
