'use strict';

// @TODO: Wait to node.js achieve harmony module.
const spawn = require('child_process').spawn;

const chalk = require('chalk');

const fs = require('fs');

class PluginChildProcess {
  constructor({isStdout=false,pluginName='',hookName='',hookParams,environment=''}={}) {
    this[Symbol.for('environment')] = environment;
    this[Symbol.for('pluginName')] = pluginName;
    this[Symbol.for('hookParams')] = hookParams;
    this[Symbol.for('hookName')] = hookName;

    this.setStdout(isStdout);
    this[Symbol.for('initPluginProcess')]();
  }

  isStdout() {
    return this[Symbol.for('isStdout')];
  }

  setStdout(isStdout = false, hasError = false) {
    this[Symbol.for('isStdout')]= isStdout;

    if (this.isStdout()) {
      this[Symbol.for('loggerPlugin')](hasError);
    }
  }

  isClose() {
    return this[Symbol.for('isClose')];
  }

  getCwd() {
    return this[Symbol.for('cwd')];
  }

  getInstance() {
    return this[Symbol.for('instance')];
  }

  getProcess() {
    return this[Symbol.for('instance')].getProcess();
  }

  getHookName() {
    return this[Symbol.for('hookName')];
  }

  getHookParams() {
    return this[Symbol.for('hookParams')];
  }

  getNameSpace() {
    const environment = this.getEnvironment();

    const nameSpace = `${environment}-hooks`;

    return nameSpace;
  }

  getPluginName() {
    return this[Symbol.for('pluginName')];
  }

  getEnvironment() {
    return this[Symbol.for('environment')];
  }

  getOutputIterator() {
    let outputQueue = this[Symbol.for('outputQueue')];
    let outputIterator = this[Symbol.for('outputGenerator')](outputQueue);
    return outputIterator;
  }

  getClosePromise() {
    const closePromise = new Promise((resolve, reject) => {
      const pluginProcess = this.getProcess();
      pluginProcess.on('close', (code) => {
        if (code === 0) {
          resolve(true);
          this[Symbol.for('isClose')] = true;
        }
      });
    });
    return closePromise;
  }

  getErrorPromise() {
    const errorPromise = new Promise((resolve, reject) => {
      const pluginChildProcess = this.getProcess();

      pluginChildProcess.stderr.on('data', (buffer) => {
        let name = this.getPluginName();
        let message = buffer.toString();
        reject({ message, name });
      });

      pluginChildProcess.on('close', (code) => {
        if (code !== 0) {
          let text = `plugin child process exited with code ${code}`;
          let name = this.getPluginName();
          reject({ text,  name });
        }
      });
    });
    return errorPromise;
  }

  *[Symbol.for('outputGenerator')](outputQueue = []) {
    while (outputQueue.length) {
      yield outputQueue.shift();
    }
  }

  [Symbol.for('initProcessOutput')]() {
    const pluginChildProcess = this.getProcess();

    this[Symbol.for('outputQueue')] = [];

    pluginChildProcess.stdout.on('data', (buffer) => {
      let text = buffer.toString();

      if (this.isStdout()) {
        process.stdout.write(text);
      }
      else {
        this[Symbol.for('outputQueue')].push(text);
      }
    });
  }

  [Symbol.for('initPluginProcess')]() {
    const environment = this.getEnvironment();
    const hookParams = this.getHookParams();
    const pluginName = this.getPluginName();
    const nameSpace = this.getNameSpace();
    const hookName = this.getHookName();
    const cwd = this.getCwd();

    try {
      const PluginClass = require(`${nameSpace}-${pluginName}`);
      const plugin = new PluginClass({ cwd, hookName, hookParams, environment });

      this[Symbol.for('instance')] = plugin;
    }
    catch (error) {
      const reason = `plugin don't exist, please check name or install first.`;
      const error = new PluginDontExistError({ reason, pluginName });
      throw error;
    }

    this[Symbol.for('initProcessOutput')]();
  }

  [Symbol.for('loggerPlugin')](hasError = false) {
    if (hasError) {
      this[Symbol.for('loggerPluginError')]();
    }
    else {
      this[Symbol.for('loggerPluginSuccess')]();
    }
  }

  [Symbol.for('loggerPluginError')]() {
    const pluginName = chalk.bold(this.getPluginName());

    const error = chalk.bold('error ....');

    const failArrow = chalk.bold.red('==>');

    console.log(`\n${failArrow} ${pluginName} ${error}\n`);
  }

  [Symbol.for('loggerPluginSuccess')]() {
    const pluginName = chalk.bold(this.getPluginName());

    const starting = chalk.bold('starting ...');

    const sucessArrow = chalk.bold.green('==>');

    console.log(`\n${sucessArrow} ${pluginName} ${starting}\n`);
  }
}

class PluginDontExistError extends Error {
  constructor({ reason = '', pluginName = '' } = {}) {
    super(reason);
    this.pluginName = pluginName;
  }
}

module.exports = PluginChildProcess;
