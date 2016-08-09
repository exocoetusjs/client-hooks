'use strict';

const exec = require('child_process').exec;

const checkGitRepo = '[ -d .git ] || git rev-parse --git-dir > /dev/null 2>&1';

process.chdir('../../');

exec(checkGitRepo, (error) => {
  if (error) {
    process.stderr.write('current directory must be a `git` repo\n');
    process.exit(1);
  }
});
