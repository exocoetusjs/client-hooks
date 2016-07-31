'use strict';

// @TODO: Wait to node.js achieve harmony module.
const spawn = require('child_process').spawn;

const fs = require('fs');

class BashChildProcess {
  constructor({ scriptPath = '', cwd = '', isStdout = false } = {}) {
    const initBashProcess = this[Symbol.for('initBashProcess')];

    this[Symbol.for('cwd')] = cwd;
    this[Symbol.for('isStdout')] = isStdout;
    this[Symbol.for('scriptPath')] = scriptPath;

    initBashProcess();
  }

  isStdout() {
    return this[Symbol.for('isStdout')];
  }

  setStdout(isStdout = false) {
    this[Symbol.for('isStdout')]= isStdout;
  }

  isClose() {
    return this[Symbol.for('isClose')];
  }

  getOutputIterator() {
    let outputIterator = this[Symbol.for('outputGenerator')]();
    return outputIterator;
  }

  getScriptPath() {
    return this[Symbol.for('scriptPath')];
  }

  getProcess() {
    return this[Symbol.for('process')];
  }

  getClosePromise() {
    let closePromise = new Promise((resolve, reject) => {
      let process = this.getProcess();
      process.on('close', (code) => {
        if (code === 0) {
          resolve(true);
          this[Symbol.for('isClose')] = true;
        }
      });
    });
  }

  getErrorPromise() {
    let errorPromise = new Promise((resolve, reject) => {
      let process = this.getProcess();
      process.stdout.on('data', (data) => {
        reject(data);
      });

      process.on('close', (code) => {
        if (code !== 0) {
          reject(`bash child process exited with code ${code}`);
        }
      });
    });
    return errorPromise;
  }

  [Symbol.for('isScriptExist')]() {
    const scriptPath = this.getScriptPath();

    try {
      fs.accessSync(scriptPath, fs.F_OK);
      return true;
    }
    catch (err) {
      return false;
    }
  }

  *[Symbol.for('outputGenerator')]() {
    let outputQueue = this[Symbol.for('outputQueue')];
    if (outputQueue.length) {
      yield outputQueue.pop();
    }
    return '';
  }

  [Symbol.for('initOuput')]() {
    const isStdout = this.isStdout();
    const process = this.getProcess();

    this[Symbol.for('isStdout')] = isStdout;
    this[Symbol.for('outputQueue')] = [];

    process.stdout.on('data', (data) => {
      if (this[Symbol.for('isStdout')]) {
        console.log(data);
      }
      else {
        this.outputQueue.push(data);
      }
    });
  }

  [Symbol.for('initBashProcess')]() {
    const isScriptExist = this[Symbol.for('isScriptExist')];

    if (this[Symbol.for('isScriptExist')]()) {
      this[Symbol.for('process')] = spawn('bash', [scriptPath], { cwd });
      this[Symbol.for('isClose')] = false;
      this[Symbol.for('initOuput')]();
    }
    else {
      let error = new ScriptDontExistError({
        scriptPath,
        reason: `The script don't exist.`,
      });
      throw error;
    }
  }
}

class ScriptDontExistError extends Error {
  constructor({ reason = '', scriptPath = '' } = {}) {
    super(reason);
    this.scriptPath = scriptPath;
  }
}

module.exports = BashChildProcess;
