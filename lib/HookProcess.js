'use strict';

// @TODO: Wait to node.js achieve harmony module.
const BashChildProcess = require('./BashChildProcess.js');

const path = require('path');

class HookProcess {
  constructor({ pluginNames = [], cwd = '' }) {
    this[Symbol.for('cwd')] = cwd;
    this[Symbol.for('pluginNames')] = pluginNames;
    this[Symbol.for('bashChildProcessMap')] = new Map();
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

  [Symbol.for('getPathByPluginName')](pluginName = '') {
    const shellName = `${pluginName}.plugin.sh`;
    const cwd = this.getCwd();
    const middlePath = path.join('node_modules', 'client-hooks', 'plugins');
    const shellPath = path.join(cwd, middlePath, pluginName, shellName);

    return shellPath;
  }

  [Symbol.for('clearChildProcess')]() {
    const bashChildProcessMap = this[Symbol.for('bashChildProcessMap')];
    const bashChildProcessArray = [...bashChildProcessMap.values()];

    bashChildProcessArray.forEach((bashChildProcess) => {
      const process = bashChildProcess.getProcess();
      process.kill();
    });
  }

  [Symbol.for('traversingPluginNames')](pluginNames = []) {
    let processArray = pluginNames.map((pluginName, idx, arr) => {
      const bashChildProcessMap = this[Symbol.for('bashChildProcessMap')];
      const scriptPath = this[Symbol.for('getPathByPluginName')](pluginName);
      const isStdout = idx ? false : true;
      let bashChildProcess;

      bashChildProcess= new BashChildProcess({isStdout,scriptPath,pluginName});
      bashChildProcessMap.set(pluginName, bashChildProcess);
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
    const bashChildProcessMap = this[Symbol.for('bashChildProcessMap')];
    const bashChildProcessArray = [...bashChildProcessMap.values()];
    const prevChildProcess = bashChildProcessArray[currentIdx - 1];
    const currentChildProcess = bashChildProcessArray[currentIdx];

    if (prevChildProcess === void 0 || prevChildProcess.isClose()) {
      if (!currentChildProcess.isStdout()) {
        this[Symbol.for('setProcessAsStdout')](currentChildProcess);
      }
      this[Symbol.for('traversingNextUnCloseChildProcess')](currentIdx + 1);
    }
  }

  [Symbol.for('traversingNextUnCloseChildProcess')](nextIdx = 1) {
    const bashChildProcessMap = this[Symbol.for('bashChildProcessMap')];
    const bashChildProcessArray = [...bashChildProcessMap.values()];
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
      const bashChildProcessMap = this[Symbol.for('bashChildProcessMap')];
      const bashChildProcess = bashChildProcessMap.get(error.name);

      this[Symbol.for('clearChildProcess')]();

      console.log(`Error name [ ${error.name} ]`);
      console.log(`Error message [ ${error.text} ]`);
      this[Symbol.for('setProcessAsStdout')](bashChildProcess);

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
