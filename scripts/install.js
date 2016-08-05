'use strict';

const shell = require('shelljs');

const gitconfigAddr = 'https://raw.githubusercontent.com/crux-wild/' +
  'client-hooks/master/.gitconfig';

const clienthooksConfigAddr = 'https://raw.githubusercontent.com/crux-wild/' +
  'client-hooks/master/clienthooks.js';

shell.config.fatal = true;

if (shell.test('-f', './.gitconfig')) {
  shell.mv('./.gitconfig', './.gitconfig.bak');
}

shell.exec(`curl -fsSL ${gitconfigAddr}`);

shell.exec(`git config --local include.path "../.gitconfig"`);

if (shell.test('-f', './clienthooks.js')) {
  shell.mv('./clienthooks.js', './clienthooks.js.bak');
}

shell.exec(`curl -fsSL ${clienthooksConfigAddr}`);
