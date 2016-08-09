'use strict';

const utils = require('./lib/utils');

const shell = require('shelljs');

const co = require('co');

shell.config.silent = true;

co(function *() {
  shell.cd('../../');

  utils.check('git');

  utils.check('node');

  yield utils.copy('.gitconfig');

  yield utils.copy('clienthooks.js');

  utils.newline();
});
