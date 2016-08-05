'use strict';

const shell = require('shelljs');

const gitconfigAddr = 'https://raw.githubusercontent.com/crux-wild/' +
  'client-hooks/master/.gitconfig';

const clienthooksConfigAddr = 'https://raw.githubusercontent.com/crux-wild/' +
  'client-hooks/master/clienthooks.js';

shell.config.fatal = true;

shell.cd('../../');

if (shell.test('-f', './.gitconfig')) {
  shell.mv('./.gitconfig', './.gitconfig.bak');
}

console.log('copy `.gitconfig`...');

shell.exec(`curl -fsSL ${gitconfigAddr}`)
  .to('.gitconfig');

shell.exec(`git config --local include.path "../.gitconfig"`);

if (shell.test('-f', './clienthooks.js')) {
  shell.mv('./clienthooks.js', './clienthooks.js.bak');
}

console.log('copy `clienthooks.js`...');

shell.exec(`curl -fsSL ${clienthooksConfigAddr}`)
  .to('./clienthooks.js');
