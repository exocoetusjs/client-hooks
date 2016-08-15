'use strict';

const _ = require('lodash');

class HookParams {
  constructor({ args = [], hookName = '' } = {}) {
    this[Symbol.for('args')] = args;
    this[Symbol.for('hookName')] = hookName;
    this[Symbol.for('params')] = this.dealArgs();
  }

  dealArgs() {
    const pluginName = this.getPluginName();

    const dealArgs = this[Symbol.for(pluginName)];

    const params = _.isFunction(dealArgs) ? dealArgs() : null;

    return params;
  }

  getPluginName() {
    return this[Symbol.for('pluginName')];
  }

  getParams() {
    return this[Symbol.for('params')];
  }

  getArgs() {
    return this[Symbol.for('args')];
  }

  [Symbol.for('applypatch-msg')]() {
  }

  [Symbol.for('pre-rebase')]() {
  }

  [Symbol.for('pre-push')]() {
  }

  [Symbol.for('update')]() {
  }

  [Symbol.for('post-update')]() {
  }

  [Symbol.for('push-to-checkout')]() {
  }

  [Symbol.for('post-rewrite')]() {
  }
}
