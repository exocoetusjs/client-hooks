'use strict';

// @TODO: Wait to node.js achieve harmony module.
const PluginChildProcess = require('./PluginChildProcess.js');

const Table = require('cli-table');

const chalk = require('chalk');

class HookProcess {
  constructor({ pluginNames = [], cwd = '' }) {
    process.env.FORCE_COLOR = 'true';

    this[Symbol.for('cwd')] = cwd;
    this[Symbol.for('pluginNames')] = pluginNames;
    this[Symbol.for('pluginChildProcessMap')] = new Map();

    this[Symbol.for('bindProcessCloseCallback')]();
  }

  start() {
    let pluginNames = this.getPluginNames();
    this[Symbol.for('traversingPluginNames')](pluginNames);
  }

  getCwd() {
    return this[Symbol.for('cwd')];
  }

  getPluginNames() {
    return this[Symbol.for('pluginNames')];
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
      const isStdout = idx ? false : true;
      let pluginChildProcess;

      pluginChildProcess= new PluginChildProcess({ isStdout, pluginName });
      pluginChildProcessMap.set(pluginName, pluginChildProcess);
      return pluginChildProcess;
    });

    let rejectPromises = processArray.map((pluginChildProcess, idx, arr) => {
      return pluginChildProcess.getErrorPromise();
    });

    let closePromises = processArray.map((pluginChildProcess, idx, arr) => {
      return pluginChildProcess.getClosePromise();
    });

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
        const message = 'program exits normally.';

        const title = 'exit';

        for (pluginChildProcess of pluginChildProcessArray) {
          pluginChildProcess.send({ title, message });
        }
      }
    });
  }
}

module.exports = HookProcess;
