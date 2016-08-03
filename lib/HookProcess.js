'use strict';

// @TODO: Wait to node.js achieve harmony module.
const BashChildProcess = require('./BashChildProcess.js');

const path = require('path');

class HookProcess {
  constructor({ pluginNames = [], cwd = '' }) {
    this[Symbol.for('cwd')] = cwd;
    this[Symbol.for('pluginNames')] = pluginNames;
    this[Symbol.for('bashChildProcessArray')] = [];
  }

  startProcess() {
    let pluginNames = this.getPluginNames();
    this[Symbol.for('traversingPluginNames')](pluginNames);
  }

  getCwd() {
    return this[Symbol.for('cwd')];
  }

  getPluginNames() {
    // @TODO: Change to set.
    return this[Symbol.for('pluginNames')];
  }

  [Symbol.for('getPathByPluginName')](pluginName = '') {
    const shellName = `${pluginName}.plugin.sh`;
    const cwd = this.getCwd();
    const shellPath = path.join(cwd, 'plugins', pluginName, shellName);

    return shellPath;
  }

  [Symbol.for('traversingPluginNames')](pluginNames = []) {
    let processArray = pluginNames.map((pluginName, idx, arr) => {
      let scriptPath = this[Symbol.for('getPathByPluginName')](pluginName);
      let isStdout = idx ? false : true;
      let bashChildProcess = new BashChildProcess({ isStdout, scriptPath });
      return bashChildProcess;
    });

    let rejectPromises = processArray.map((bashChildProcess, idx, arr) => {
      return bashChildProcess.getErrorPromise();
    });

    let closePromises = processArray.map((bashChildProcess, idx, arr) => {
      return bashChildProcess.getClosePromise();
    });

    this[Symbol.for('bindExitCallback')](rejectPromises);
    this[Symbol.for('bindCloseCallback')](closePromises);
    this[Symbol.for('bashChildProcessArray')] = [...processArray];
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
    const bashChildProcessArray = this[Symbol.for('bashChildProcessArray')];
    const prevChildProcess = bashChildProcessArray[currentIdx - 1];
    const currentChildProcess = bashChildProcessArray[currentIdx]

    if (!currentChildProcess.isStdout()) {
      this[Symbol.for('setProcessAsStdout')](currentChildProcess);
    }

    if (prevChildProcess === void 0 || prevChildProcess.isClose()) {
      this[Symbol.for('traversingNextUnCloseChildProcess')](currentIdx + 1);
    }
  }

  [Symbol.for('traversingNextUnCloseChildProcess')](nextIdx = 1) {
    const bashChildProcessArray = this[Symbol.for('bashChildProcessArray')];
    const setProcessAsStdout = this[Symbol.for('setProcessAsStdout')];
    const nextChildProcessArray = bashChildProcessArray.slice(nextIdx);

    nextChildProcessArray.forEach((nextChildProcess, idx, arr) => {
      setProcessAsStdout(nextChildProcess);
    });
  }

  [Symbol.for('setProcessAsStdout')](nextChildProcess) {
    let outputIterator = nextChildProcess.getOutputIterator();

    // ouput caching results
    for (let output of outputIterator) {
      process.stdout.write(output);
    }

    // switching output child process
    nextChildProcess.setStdout(true);
  }

  [Symbol.for('bindExitCallback')](rejectPromises = []) {
    const getAnyRejectPromise = this[Symbol.for('getAnyRejectPromise')];
    const anyRejectPromise = getAnyRejectPromise(rejectPromises);

    anyRejectPromise.catch((error) => {
      console.log(error);
      console.log('hook process abnormal exit.');
      process.exit(1);
    });
  }

  [Symbol.for('getAnyRejectPromise')](promises = []) {
    // @TODO: Print error process outputQueue.
    let anyRejectPromise = new Promise((fulfillOuter, rejectOuter) => {
      for (let promise of promises) {
        promise.catch((error) => {
          rejectOuter(error);
        });
      }
    });
    return anyRejectPromise;
  }
}

module.exports = HookProcess;
