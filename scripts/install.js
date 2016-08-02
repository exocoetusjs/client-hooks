'use strict';

const shell = require('shelljs');

if (shell.test('-f', './.gitconfig')) {
  shell.mv('./.gitconfig', './.gitconfig.bak', { clobber: false });
}

shell.cp('./node_modules/client-hooks/.gitconfig', './gitconfig');

shell.exec(`git config --local include.path "../.gitconfig"`);

if (shell.test('-f', './clienthooks.js')) {
  shell.mv('./clienthooks.js', './clienthooks.js.bak', { clobber: false });
}

shell.cp('./node_modules/clienthooks/clienthooks.js', 'clienthooks.js');
