'use strict';

class HookParams {
  constructor({ args = [], hookName = '' } = {}) {
    this[Symbol.for('hookName')] = hookName;
    this[Symbol.for('args')] = args;
  }

  [Symbol.for('getParams')]() {
    const pluginName = this[Symbol.for('pluginName')];

    const dealArgs = this[Symbol.for(pluginName)];

    let params;

    if (typeof dealArgs === 'function') {
      params = dealArgs();
    } else {
      params = null;
    }

    return params;
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
