'use strict';

// @TODO: Wait to node.js achieve harmony module.
const child_process = require('child_process');

const fs = require('fs');

const ChildProcess = child_process.constructor;

class BashChildProcess extends ChildProcess {
  constructor({ scriptPath='', cwd='', isStdout=false } = {}) {
    this[Symbol.for('isScriptExist')].then(
      function fulfill(result) {
        Object.assign(this, spawn('bash', [scriptPath], { cwd }));

        this[Symbol.for('isClose')] = false;
        this[Symbol.for('initOuput')](isStdout);
      },
      function reject(result) {
        let error = new ScriptDontExistError({
          scriptPath,
          reason: `The script don't exist.`,
        });
        throw error;
      }
    );
  }

  static [Symbol.for('isScriptExist')](scriptPath='') {
    let checkResultPromise = new Promise((resolve, reject) => {
      fs.access(path, fs.F_OK, (err) => {
        if (err) {
          reject(true);
        }
        else {
          resolve(false);
        }
      });
    });
    return checkResultPromise;
  }

  *[Symbol.for('outputGenerator')]() {
    let outputQueue = this[Symbol.for('outputQueue')];
    if (outputQueue) {
      yield outputQueue.pop();
    }
    return null;
  }

  [Symbol.for('initOuput')](isStdout = false) {
    this[Symbol.for('isStdout')] = isStdout;
    this[Symbol.for('outputQueue')] = [];

    this.stdout.on('data', (data) => {
      if (this[Symbol.for('isStdout')]) {
        console.log(data);
      }
      else {
        this.outputQueue.push(data);
      }
    });
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

  getClosePromise() {
    let closePromise = new Promise((resolve, reject) => {
      this.on('close', (code) => {
        if (code === 0) {
          resolve(true);
          this[Symbol.for('isClose')] = true;
        }
      });
    });
  }

  getErrorPromise() {
    let errorPromise = new Promise((resolve, reject) => {
      this.stdout.on('data', (data) => {
        reject(data);
      });

      this.on('close', (code) => {
        if (code !== 0) {
          reject(`bash child process exited with code ${code}`);
        }
      });
    });
    return errorPromise;
  }
}

class ScriptDontExistError extends Error {
  constructor({reason = '', scriptPath = ''}) {
    super(reason);
    this.scriptPath = scriptPath;
  }
}

module.exports = BashChildProcess;
