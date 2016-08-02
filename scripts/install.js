'use strict';

const shell = require('shelljs');

if (shell.test('-f', './.gitconfig')) {
  mv('./.gitconfig', './.gitconfig.bak');
}
