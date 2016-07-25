const ChildProcess = require('child_process');

const fs = require('fs');

class BashChildProcess extends ChildProcess {
  constructor({ scriptPath='', cwd='', isStdout=false } = {}) {
    this.isScriptExist.then(
      function fulfill(result) {
        this = ChildProcess.spawn('bash', [scriptPath], { cwd });

        this._initOutput(isStdout);
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

  _initOutput(isStdout = false) {
    this._isStdout = isStdout;
    this._outputQueue = [];

    this.stdout.on('data', (data) => {
      if (this.isStdout) {
        console.log(data);
      }
      else {
        this.outputQueue.push(data);
      }
    });
  }

  *_outputGenerator() {
    let outputQueue = this._outputQueue;
    if (outputQueue) {
      yield outputQueue.pop();
    }
    return null;
  }

  static isScriptExist(scriptPath='') {
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

  setIsStdout(isStdout = false) {
    this._isStdout = isStdout;
  }

  getOutputIterator() {
    let outputIterator = *_outputGenerator();
    return outputIterator;
  }


  getError() {
    let ErrorPromise = new Promise((resolve, reject) => {
      this.stdout.on('data', (data) => {
        reject(data);
      });

      this.on('close', (code) => {
        if (code !== 0) {
          reject(`bash child process exited with code ${code}`);
        }
      });
    });
    return Errorpromise;
  }
}

class ScriptDontExistError extends Error {
  constructor({reason = '', scriptPath = ''}) {
    super(reason);
    this.scriptPath = scriptPath;
  }
}
