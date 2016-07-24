const spawn = require('child_process');

const fs = require('fs');

class BashChildProcess extends ChildProcess {
  constructor({ scriptPath='', cwd='' } = {}) {
    this.isScriptExist.then(
      function fulfill(result) {
        this = spawn('bash', [scriptPath], { cwd });
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

  getError() {
    let ErrorPromise = new Promise(function(resolve, reject) {
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
