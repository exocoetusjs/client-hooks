'use strict';

const utils = require('./lib/utils');

const shell = require('shelljs');

shell.cd('../../');

utils.copy('.gitconfig');

utils.copy('clienthooks.js');

utils.newline();

