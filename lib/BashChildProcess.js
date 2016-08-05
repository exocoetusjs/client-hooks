'use strict';

// @TODO: Wait to node.js achieve harmony module.
const spawn = require('child_process').spawn;

const fs = require('fs');

class BashChildProcess {
  constructor({ scriptPath='',cwd='',isStdout=false, pluginName='' } = {}) {
    this[Symbol.for('pluginName')] = pluginName;
    this[Symbol.for('scriptPath')] = scriptPath;
    this[Symbol.for('isStdout')] = isStdout;
    this[Symbol.for('cwd')] = cwd;

    this[Symbol.for('initBashProcess')]();
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

  getCwd() {
    return this[Symbol.for('cwd')];
  }

  getProcess() {
    return this[Symbol.for('process')];
  }

  getPluginName() {
    return this[Symbol.for('pluginName')];
  }

  getScriptPath() {
    return this[Symbol.for('scriptPath')];
  }

  getOutputIterator() {
    let outputQueue = this[Symbol.for('outputQueue')];
    let outputIterator = this[Symbol.for('outputGenerator')](outputQueue);
    return outputIterator;
  }

  getClosePromise() {
    let closePromise = new Promise((resolve, reject) => {
      let bashProcess = this.getProcess();
      bashProcess.on('close', (code) => {
        if (code === 0) {
          resolve(true);
          this[Symbol.for('isClose')] = true;
        }
      });
    });
    return closePromise;
  }

  getErrorPromise() {
    let errorPromise = new Promise((resolve, reject) => {
      let bashChildProcess = this.getProcess();

      bashChildProcess.stderr.on('data', (buffer) => {
        let name = this.getPluginName();
        let text = buffer.toString();
        reject({ text, name });
      });

      bashChildProcess.on('close', (code) => {
        if (code !== 0) {
          let text = `bash child process exited with code ${code}`;
          let name = this.getPluginName();
          reject({ text,  name });
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

  *[Symbol.for('outputGenerator')](outputQueue = []) {
    while (outputQueue.length) {
      yield outputQueue.shift();
    }
  }

  [Symbol.for('initOuput')]() {
    const isStdout = this.isStdout();
    const bashChildProcess = this.getProcess();

    this[Symbol.for('outputQueue')] = [];
    this[Symbol.for('isStdout')] = isStdout;

    bashChildProcess.stdout.on('data', (buffer) => {
      let text = buffer.toString();

      if (this.isStdout()) {
        process.stdout.write(text);
      }
      else {
        this[Symbol.for('outputQueue')].push(text);
      }
    });
  }

  [Symbol.for('initBashProcess')]() {
    const isScriptExist = this[Symbol.for('isScriptExist')];
    const scriptPath = this.getScriptPath();
    const cwd = this.getCwd();

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
