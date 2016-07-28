// @TODO: Wait to node.js achieve harmony module.

const BashChildProcess = require('./BashChildProcess.js');

class HooksProcess {
  constructor(pluginNames = []) {
    this.bashChildProcessMap = new Map();
    this.[Symbol.for('traversingPluginNames')](pluginNames);
  }

  [Symbol.for('traversingPluginNames')](pluginNames = []) {
    let rejectPromises = pluginNames.map((pluginName, idx, arr) => {
      let scriptPath = this.[Symbol.for('getPathByPluginName')](pluginName);
      let isStdout = idx ? true : false;
      let bashChildProcess = new BashChildProcess({ isStdout, scriptPath });

      this.bashChildProcessMap.set(pluginName, BashChildProcess);
      return BashChildProcess.getErrorPromise();
    });
    this.[Symbol.for('bindExitCallback')](rejectPromises);
  }

  [Symbol.for('getPathByPluginName')](pluginName) {
    // @TODO: Get plugin main script path by pluginName.
  }

  [Symbol.for('bindExitCallback')](rejectPromises) {
    const getAnyRejectPromise = this.[Symbol.for('getAnyRejectPromise')];

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

export HooksProcess;
