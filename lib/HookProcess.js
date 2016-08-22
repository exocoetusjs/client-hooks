'use strict';

// @TODO: Wait to node.js achieve harmony module.
const PluginChildProcess = require('./PluginChildProcess.js');

const HookParams = require('./HookParams.js');

const Table = require('cli-table');

const chalk = require('chalk');

const is = require('is_js');

class HookProcess {
  constructor({ pluginNames = [], cwd = '', hookName = '' }) {
    process.env.FORCE_COLOR = 'true';

    this[Symbol.for('cwd')] = cwd;
    this[Symbol.for('hookName')] = hookName;
    this[Symbol.for('pluginNames')] = pluginNames;
    this[Symbol.for('pluginChildProcessMap')] = new Map();

    this[Symbol.for('initHookParams')]();
    this[Symbol.for('initEnvironment')]();
  }

  start() {
    let pluginNames = this.getPluginNames();
    this[Symbol.for('traversingPluginNames')](pluginNames);
  }

  getHookName() {
    return this[Symbol.for('hookName')];
  }

  getHookParams() {
    return this[Symbol.for('hookParams')];
  }

  getPluginNames() {
    return this[Symbol.for('pluginNames')];
  }

  getEnvironment() {
    return this[Symbol.for('environment')];
  }

  [Symbol.for('initEnvironment')]() {
    const hookName = this.getHookName();

    if (hookName.match(/^(pre-receive|update|post-receive|post-update)$/)){
      this[Symbol.for('environment')] = 'server';
    } else {
      this[Symbol.for('environment')] = 'client';
    }
  }

  [Symbol.for('initHookParams')]() {
    const hookName = this.getHookName();

    const argv = process.argv;

    this[Symbol.for('hookParams')] = new HookParams({ argv, hookName });
  }

  [Symbol.for('clearChildProcess')]() {
    const pluginChildProcessMap = this[Symbol.for('pluginChildProcessMap')];
    const pluginChildProcessArray = [...pluginChildProcessMap.values()];

    pluginChildProcessArray.forEach((pluginChildProcess) => {
      const process = pluginChildProcess.getProcess();
      process.kill();
    });
  }

  [Symbol.for('traversingPluginNames')](pluginNames = []) {
    let processArray = pluginNames.map((pluginName, idx, arr) => {
      const pluginChildProcessMap = this[Symbol.for('pluginChildProcessMap')];
      const environment = this.getEnvironment();
      const hookParams = this.getHookParams();
      const isStdout = idx ? false : true;
      const hookName = this.getHookName();
      let pluginChildProcess;

      pluginChildProcess=new PluginChildProcess({isStdout,pluginName,hookName,hookParams,environment});
      pluginChildProcessMap.set(pluginName, pluginChildProcess);
      return pluginChildProcess;
    });

    let rejectPromises = processArray.map((pluginChildProcess, idx, arr) => {
      return pluginChildProcess.getErrorPromise();
    });

    let closePromises = processArray.map((pluginChildProcess, idx, arr) => {
      return pluginChildProcess.getClosePromise();
    });

    this[Symbol.for('bindProcessCloseCallback')]();
    this[Symbol.for('bindExitCallback')](rejectPromises);
    this[Symbol.for('bindCloseCallback')](closePromises);
  }

  [Symbol.for('bindCloseCallback')](closePromises = []) {
    closePromises.forEach((promise, idx, arr) => {
      promise.then((flag) => {
        if (flag) {
          this[Symbol.for('switchChildProcessOutput')](idx);
        }
      });
    });
  }

  [Symbol.for('switchChildProcessOutput')](currentIdx = 0) {
    const pluginChildProcessMap = this[Symbol.for('pluginChildProcessMap')];
    const pluginChildProcessArray = [...pluginChildProcessMap.values()];
    const prevChildProcess = pluginChildProcessArray[currentIdx - 1];
    const currentChildProcess = pluginChildProcessArray[currentIdx];

    if (prevChildProcess === void 0 || prevChildProcess.isClose()) {
      if (!currentChildProcess.isStdout()) {
        this[Symbol.for('setProcessAsStdout')](currentChildProcess);
      }
      this[Symbol.for('traversingNextUnCloseChildProcess')](currentIdx + 1);
    }
  }

  [Symbol.for('traversingNextUnCloseChildProcess')](nextIdx = 1) {
    const pluginChildProcessMap = this[Symbol.for('pluginChildProcessMap')];
    const pluginChildProcessArray = [...pluginChildProcessMap.values()];
    const setProcessAsStdout = this[Symbol.for('setProcessAsStdout')];
    const nextChildProcessArray = pluginChildProcessArray.slice(nextIdx);

    nextChildProcessArray.forEach((nextChildProcess, idx, arr) => {
      setProcessAsStdout(nextChildProcess);
    });
  }

  [Symbol.for('setProcessAsStdout')](nextChildProcess, hasError = false) {
    let outputIterator = nextChildProcess.getOutputIterator();

    // switching output child process
    nextChildProcess.setStdout(true, hasError);
    // ouput caching results
    for (let output of outputIterator) {
      process.stdout.write(output);
    }
  }

  [Symbol.for('bindExitCallback')](rejectPromises = []) {
    const getAnyRejectPromise = this[Symbol.for('getAnyRejectPromise')];
    const anyRejectPromise = getAnyRejectPromise(rejectPromises);

    anyRejectPromise.catch((error) => {
      const pluginChildProcessMap = this[Symbol.for('pluginChildProcessMap')];
      const pluginChildProcess = pluginChildProcessMap.get(error.name);

      this[Symbol.for('clearChildProcess')]();

      if (!pluginChildProcess.isStdout()) {
        this[Symbol.for('setProcessAsStdout')](pluginChildProcess, true);
      }

      this[Symbol.for('loggerError')](error);

      process.exit(1);
    });
  }

  [Symbol.for('loggerError')](error) {
    const title = chalk.gray.bold('\n>>>>>>>> ERROR! >>>>>>>');
    const divider = chalk.gray.bold('======================');

    const table = new Table({
      chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
        'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚',
        'bottom-right': '╝', 'left': '║', 'left-mid': '╟',
        'mid': '─', 'mid-mid': '┼', 'right': '║', 'right-mid': '╢',
        'middle': '│'
      }
    });

    table.push(
      { 'Error plugin': error.name  },
      { 'Error message': error.message }
    );

    process.stderr.write(`${title}\n` + table.toString() + `\n${divider}\n`);
  }

  [Symbol.for('getAnyRejectPromise')](promises = []) {
    let anyRejectPromise = new Promise((fulfillOuter, rejectOuter) => {
      for (let promise of promises) {
        promise.catch((error) => {
          rejectOuter(error);
        });
      }
    });
    return anyRejectPromise;
  }

  [Symbol.for('bindProcessCloseCallback')]() {
    const pluginChildProcessMap = this[Symbol.for('pluginChildProcessMap')];
    const pluginChildProcessArray = [...pluginChildProcessMap.values()];

    process.on('exit', (code) => {
      // process exits normally
      if (code === 0) {
        for (let pluginChildProcess of pluginChildProcessArray) {
          let postClosed = pluginChildProcess.getInstance().postClosed;

          if (is.function(postClosed)) {
            postClosed();
          }
        }
      }
    });
  }
}

module.exports = HookProcess;
