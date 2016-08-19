'use strict';

// @TODO: Wait to node.js achieve harmony module.
const HookProcess = require('./HookProcess.js');

const chalk = require('chalk');

const path = require('path');

class ClientHook {
  constructor({ hookName='', cwd='' }) {
    this[Symbol.for('cwd')]= cwd;
    this[Symbol.for('hookName')]= hookName;
  }

  start() {
    const pluginNames = this[Symbol.for('getPluginNames')]();
    const hookName = this.getHookName();
    const cwd = this.getCwd();
    let hookProcess;

    this[Symbol.for('loggerHook')]();
    hookProcess = new HookProcess({ pluginNames, cwd, hookName });
    hookProcess.start();
  }

  getCwd() {
    return this[Symbol.for('cwd')];
  }

  getHookName() {
    return this[Symbol.for('hookName')];
  }

  [Symbol.for('getPluginNames')]() {
    const config = this[Symbol.for('getConfiguartion')](this.getCwd());
    let pluginNames = config[this.getHookName()] || [];

    // Remove duplicate elements.
    let pluginNameSet = new Set(pluginNames);
    pluginNames = [...pluginNameSet];
    return pluginNames;
  }

  [Symbol.for('getConfiguartion')]() {
    const configPath = path.join(this.getCwd(), 'clienthooks.js');

    let config;

    try {
      config = require(configPath);
    } catch (error) {
      const reason = error.reason;

      const error = new ConfigDontExistError(reason);

      throw error;
    }

    return config;
  }

  [Symbol.for('loggerHook')]() {
    const hookName = chalk.bold(this.getHookName());

    const message = chalk.bold('starting ...');

    const colon = chalk.bold.blue('::');

    console.log(`${colon} ${hookName} ${message}`);
  }
}

class ConfigDontExistError extends Error {
  constructor({ reason = ''} = {}) {
    super(reason);
  }
}

module.exports = ClientHook;
