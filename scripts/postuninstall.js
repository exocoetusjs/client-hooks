'use strict';

const shell = require('shelljs');

if (shell.test('-f', './.gitconfig')) {
  rm('./.gitconfig');
}

if (shell.test('-f', './clienthooks.js')) {
  rm('./clienthooks.js');
}
