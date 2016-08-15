'use strict';

const _ = require('lodash');

class HookParams {
  constructor({ args = [], hookName = '' } = {}) {
    this[Symbol.for('hookName')] = hookName;
    this[Symbol.for('args')] = args;

    this[Symbol.for('initParams')]();
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

  [Symbol.for('initParams')]() {
    const dealArgs = this.getDealArgs();

    const params = _.isFunction(dealArgs) ? dealArgs() : null;

    this[Symbol.for('params')] = params;
  }

  [Symbol.for('getDealArgs')]() {
    const pluginName = this.getPluginName();

    const dealArgs = this[Symbol.for(pluginName)];

    return dealArgs;
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
