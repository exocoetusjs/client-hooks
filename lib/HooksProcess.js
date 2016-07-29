'use strict';

// @TODO: Wait to node.js achieve harmony module.
const BashChildProcess = require('./BashChildProcess.js');

class HooksProcess {
  constructor(pluginNames = []) {
    this[Symbol.for('bashChildProcessArray')]= [];
    this[Symbol.for('traversingPluginNames')](pluginNames);
  }

  static [Symbol.for('getPathByPluginName')](pluginName = '') {
    // @TODO: Get plugin main script path by pluginName.
  }

  [Symbol.for('traversingPluginNames')](pluginNames = []) {
    let rejectPromises = pluginNames.map((pluginName, idx, arr) => {
      let scriptPath = this[Symbol.for('getPathByPluginName')](pluginName);
      let isStdout = idx ? true : false;
      let bashChildProcess = new BashChildProcess({ isStdout, scriptPath });

      this[Symbol.for('bashChildProcessArray')]= BashChildProcess;
      return BashChildProcess.getErrorPromise();
    });
    this[Symbol.for('bindExitCallback')](rejectPromises);
  }

  [Symbol.for('bindCloseCallback')](closePromises= []) {
    closePromise.forEach((promise, idx, arr) => {
      promise.then((flag) => {
        if (flag) this[Symbol.for('switchChildProcessOutput')](idx);
      });
    });
  }

  [Symbol.for('switchChildProcessOutput')](currentIdx = 0) {
    let bashChildProcessArray = this[Symbol.for('bashChildProcessArray')];
    let prevChildProcess = bashChildProcessArray[currentIdx - 1];
    let outputIterator = nextChildProcess.getOutputIterator();

    if (prevChildProcess === void 0 || prevChildProcess.isClose()) {
      this[Symbol.for('traversingNextUnCloseChildProcess')](currentIdx + 1);
    }
  }

  [Symbol.for('traversingNextUnCloseChildProcess')](nextIdx = 1) {
    const processArray = this[Symbol.for('bashChildProcessArray')];
    const setProcessAsStdout = this[Symbol.for('setProcessAsStdout')];

    for (let process = processArray[nextIdx];
      !nextChildProcess.isClose(); nextIdx = nextIdx + 1) {
        setProcessAsStdout(nextChildProcess);
    }
  }

  [Symbol.for('setProcessAsStdout')](nextChildProcess) {
    let outputIterator = nextChildProcess.getOutputIterator();

    // ouput caching results
    for (let output of outputIterator) {
      console.log(ouput);
    }
    // switching output child process
    nextChildProcess.setStdout(true);
  }

  [Symbol.for('bindExitCallback')](rejectPromises = []) {
    const getAnyRejectPromise = this[Symbol.for('getAnyRejectPromise')];

    anyRejectPromise = getAnyRejectPromise(rejectPromises);
    anyRejectPromise.reject((error) => {
      console.log('hook process abnormal exit.');
      process.exit(1);
    });
  }

  [Symbol.for('getAnyRejectPromise')](promises = []) {
    let anyRejectPromise = new Promise((fulfillOuter, rejectOuter) => {
      for (let promise of promises) {
        promise.reject((error) => {
          rejectOuter(error);
        });
      }
    });
    return anyRejectPromise;
  }
}

module.export = HooksProcess;
