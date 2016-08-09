'use strict';

const semverUtils = require('semver-utils');

const semver = require('semver');

const shell = require('shelljs');

const git_ver = shell.exec('git --version');

console.log(semverUtils.parse(git_ver));
