'use strict';

// @TODO: Wait to node.js achieve harmony module.
const HookProcess = require('./HookProcess.js');

const path = require('path');

class ClientHook {
  constructor({ hookName='', cwd='' }) {
    this.cwd = cwd;
    this.hookName = hookName;
  }

  start() {
    let pluginNames = this[Symbol.for('getPluginNames')]();
    let hookProcess = new HookProcess(pluginNames);

    this[Symbol.for('printCurrentHookLog')]();
    HookProcess.startProcess();
  }

  [Symbol.for('getPluginNames')]() {
    const config = this[Symbol.for('getConfiguartion')](this.cwd);
    const pluginName = config[this.hookName] || '';
    return pluginName;
  }

  [Symbol.for('getConfiguartion')]() {
    const config = require(path.join(this.cwd, 'clienthooks.js'));
    return config;
  }

  [Symbol.for('printCurrentHookLog')]() {
    // @TODO: Print current hook log.
  }
}

module.exports = ClientHook;
