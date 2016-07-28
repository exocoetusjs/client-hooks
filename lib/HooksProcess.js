// @TODO: Wait to node.js achieve harmony module.

const BashChildProcess = require('./BashChildProcess.js');

class HooksProcess {
  constructor(pluginNames = []) {
    this.bashChildProcessArray = [];
    this.[Symbol.for('traversingPluginNames')](pluginNames);
  },

  static [Symbol.for('getPathByPluginName')](pluginName = '') {
    // @TODO: Get plugin main script path by pluginName.
  },

  [Symbol.for('traversingPluginNames')](pluginNames = []) {
    let rejectPromises = pluginNames.map((pluginName, idx, arr) => {
      let scriptPath = this.[Symbol.for('getPathByPluginName')](pluginName);
      let isStdout = idx ? true : false;
      let bashChildProcess = new BashChildProcess({ isStdout, scriptPath });

      this.bashChildProcessArray = BashChildProcess;
      return BashChildProcess.getErrorPromise();
    });
    this.[Symbol.for('bindExitCallback')](rejectPromises);
  },

  [Symbol.for('bindCloseCallback')](closePromises= []) {
    closePromise.forEach((promise, idx, arr) {
      promise.then((flag) => {
        if (flag) this.[Symbol.for('switchChildProcessOutput')](idx);
      });
    });
  },

  [Symbol.for('switchChildProcessOutput')](currentIdx = 0) {
    let prevChildProcess = this.bashChildProcessArray[currentIdx - 1];

    let outputIterator = nextChildProcess.getOutputIterator();

    if (prevChildProcess === void 0 || prevChildProcess.isClose()) {
      this.[Symbol.for('traversingNextCloseChildProcess')](currentIdx);
    }
  },

  [Symbol.for('traversingNextCloseChildProcess')](currentIdx = 0) {
    while (let nextIdx = currentIdx + 1) {
      let nextChildProcess = this.bashChildProcessArray[nextIdx];

      if (!nextChildProcess.isClose()) {
        break;
      }
      // ouput caching results
      for (let output of outputIterator) {
        console.log(ouput);
      }
      // switching output child process
      nextChildProcess.setStdout(true);

      currentIdx = currentIdx + 1;
    }
  },

  [Symbol.for('bindExitCallback')](rejectPromises = []) {
    const getAnyRejectPromise = this.[Symbol.for('getAnyRejectPromise')];

    anyRejectPromise = getAnyRejectPromise(rejectPromises);
    anyRejectPromise.reject((error) => {
      console.log('hook process abnormal exit.');
      process.exit(1);
    });
  },

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

export HooksProcess;
