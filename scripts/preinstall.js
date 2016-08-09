'use strict';

const exec = require('child_process').exec;

const checkGitRepo = '[ -d .git ] || git rev-parse --git-dir > /dev/null 2>&1';

process.chdir('../../');

exec(checkGitRepo, (error) => {
  if (error) {
    const title = '\x1b[31mERR!';

    const message = '\x1b[0mcurrent directory must be a `git` repo\n';

    const error = `${title} ${message}`;

    process.stderr.write(error);

    process.exit(1);
  }
});
