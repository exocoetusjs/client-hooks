const ChildProcess = require('child_process');

const fs = require('fs');

class BashChildProcess extends ChildProcess {
  constructor({ scriptPath='', cwd='', isStdout: false } = {}) {
    this.isScriptExist.then(
      function fulfill(result) {
        this = ChildProcess.spawn('bash', [scriptPath], { cwd });

        this.initOutput();
      },
      // @TODO: The need for custom error
      function reject(result) {
        throw new Error(`The script don't exist.`);
      }
    );
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

  initOutput() {
    this.isStdout = isStdout;
    this.outputQueue = [];

    this.stdout.on('data', (data) => {
      if (this.isStdout) {
        console.log(data);
      }
      else {
        this.stdoutQueue.push(data);
      }
    });
  }

  setIsStdout(isStdout = false) {
    this.isStdout = isStdout;
  }

  getOutputQueue() {
    return this.outputQueue;
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
