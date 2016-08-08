'use strict';

const utils = require('./lib/utils');

const shell = require('shelljs');

const co = require('co');

co(function *() {
  shell.cd('../../');

  yield utils.copy('.gitconfig');

  yield utils.copy('clienthooks.js');

  utils.newline();
});
