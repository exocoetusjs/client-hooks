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
    return this[Symbol.for('pluginNames')];
  }

  getBashChildProcessArray() {
    return this[Symbol.for('bashChildProcessArray')];
  }

  [Symbol.for('getPathByPluginName')](pluginName = '') {
    const shellName = `${pluginName}.plugin.sh`;
    const cwd = this.getCwd();
    const shellPath = path.join(cwd, 'plugins', pluginName, shellName);

    return shellPath;
  }

  [Symbol.for('traversingPluginNames')](pluginNames = []) {
    let rejectPromises = pluginNames.map((pluginName, idx, arr) => {
      let bashChildProcessArray = this.getBashChildProcessArray();
      let scriptPath = this[Symbol.for('getPathByPluginName')](pluginName);
      let isStdout = idx ? false : true;
      let bashChildProcess = new BashChildProcess({ isStdout, scriptPath });

      bashChildProcessArray.push(bashChildProcess);
      return bashChildProcess.getErrorPromise();
    });
    this[Symbol.for('bindExitCallback')](rejectPromises);
  }

  [Symbol.for('bindCloseCallback')](closePromises= []) {
    closePromise.forEach((promise, idx, arr) => {
      promise.then((flag) => {
        if (flag) {
          this[Symbol.for('switchChildProcessOutput')](idx);
        }
      });
    });
  }

  [Symbol.for('switchChildProcessOutput')](currentIdx = 0) {
    let bashChildProcessArray = this.getBashChildProcessArray();
    let prevChildProcess = bashChildProcessArray[currentIdx - 1];
    let outputIterator = nextChildProcess.getOutputIterator();

    if (prevChildProcess === void 0 || prevChildProcess.isClose()) {
      this[Symbol.for('traversingNextUnCloseChildProcess')](currentIdx + 1);
    }
  }

  [Symbol.for('traversingNextUnCloseChildProcess')](nextIdx = 1) {
    let bashChildProcessArray = this.getBashChildProcessArray();
    const setProcessAsStdout = this[Symbol.for('setProcessAsStdout')];

    for (let nextChildProcess= bashChildProcessArray[nextIdx];
      !nextChildProcess.isClose(); nextIdx = nextIdx + 1) {
        setProcessAsStdout(nextChildProcess);
    }
  }

  [Symbol.for('setProcessAsStdout')](nextChildProcess) {
    let outputIterator = nextChildProcess.getOutputIterator();

    // ouput caching results
    for (let output of outputIterator) {
      process.stdout.write(ouput);
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
