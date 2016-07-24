const spawn = require('child_process');

class BashChildProcess extends ChildProcess {
  constructor({ scriptPath='' } = {}) {
    if (scriptPath) {
      this = spawn('bash', [scriptPath]);
    }
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
