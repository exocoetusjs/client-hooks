'use strict';

const utils = require('./lib/utils');

const shell = require('shelljs');

shell.cd('../../');

utils.remove('.gitconfig');

utils.remove('clienthooks.js');

utils.newline();

