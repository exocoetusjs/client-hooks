'use strict';

// @TODO: Wait to node.js achieve harmony module.
const BashChildProcess = require('./HookProcess.js');

class ClientHook {
  constructor(hookName = '') {
    this.hookName = hookName;
  }

  [Symbol.for('getPluginNames')]() {
    // @TODO: Discovery configuration
  }

  [Symbol.for('startHookProcess')]() {
    // @TODO: Start the hook process
  }

  // ...
}

module.exports = ClientHook;
