'use strict';

// @TODO: Wait to node.js achieve harmony module.
const BashChildProcess = require('./HookProcess.js');

class ClientHook {
  constructor({ hookName='', cwd='' }) {
    this.cwd = cwd;
    this.hookName = hookName;
  }

  [Symbol.for('getPluginNames')]() {
    // @TODO: Discovery configuration
  }

  [Symbol.for('startHookProcess')]() {
    // @TODO: Start the hook process
  }

  [Symbol.for('printCurrentHookLog')]() {
    // @TODO: Print current hook log.
  }

  // ...
}

module.exports = ClientHook;
