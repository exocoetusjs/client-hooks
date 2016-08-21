'use strict';

const is = require('is_js');

class HookParams {
  constructor({ argv = [], hookName = '' } = {}) {
    this[Symbol.for('hookName')] = hookName;

    this[Symbol.for('initParams')]();
  }

  getPluginName() {
    return this[Symbol.for('pluginName')];
  }

  getParams() {
    return this[Symbol.for('params')];
  }

  getArgv() {
    return this[Symbol.for('argv')];
  }

  [Symbol.for('initParams')]() {
    const dealargv = this[Symbol.for('getDealArgv')]();

    const params = is.function(dealArgv) ? dealArgv() : null;

    this[Symbol.for('params')] = params;
  }

  [Symbol.for('getDealArgv')]() {
    const pluginName = this.getPluginName();

    const dealArgv = this[Symbol.for(pluginName)];

    return dealArgv;
  }

  /**
   * @private
   *
   * It takes a single parameter, the name of the file that holds the proposed
   * commit log message.
   */
  [Symbol.for('applypatch-msg')]() {
    const argv = this.getArgv();

    const commitMessageFileName = argv[0];

    return { commitMessageFileName};
  }

  /**
   * @private
   *
   * The hook may be called with one or two parameters. The first parameter is
   * the upstream from which the series was forked. The second parameter is the
   * branch being rebased, and is not set when rebasing the current branch.
   */
  [Symbol.for('pre-rebase')]() {
    const argv = this.getArgv();

    const forkBranch = argv[0];

    const rebaseBranch = argv[1];

    return { forkBranch, rebaseBranch };
  }

  /**
   * @private
   *
   * The hook is called with two parameters which provide the name and location
   * of the destination remote, if a named remote is not being used both values
   * will be the same.
   */
  [Symbol.for('pre-push')]() {
    const argv = this.getArgv();

    const remoteName = argv[0];

    const remoteLocation = argv[1];

    return { remoteName, remoteLocation };
  }

  /**
   * @private
   * This hook executes once for the receive operation. It takes no arguments,
   * but for each ref to be updated it receives on standard input a line of the
   * format:
   *
   * ```
   * <old-value> SP <new-value> SP <ref-name> LF
   * ```
   * where `<old-value>` is the old object name stored in the ref, `<new-value>`
   * is the new object name to be stored in the ref and `<ref-name>` is the
   * full name of the ref. When creating a new ref, `<old-value>` is 40 `0`.
   */
  [Symbol.for('pre-receives')]() {
    const argv = this.getArgv();

    const oldValue = argv[0];

    const newValue = argv[1];

    const refName = argv[2];

    return { oldValue, newValue, refName };
  }

  /**
   * @private
   *
   * The hook executes once for each ref to be updated, and takes three
   * parameters:
   *
   * - the name of the ref being updated,
   * - the old object name stored in the ref,
   * - and the new object name to be stored in the ref.
   */
  [Symbol.for('update')]() {
    const argv = this.getArgv();

    const updateRef = argv[0];

    const oldObjectName = argv[1];

    const newObjectName = argv[2];

    return { updateRef, oldObjectName, newObjectName };
  }

  /**
   * @private
   *
   * It takes a variable number of parameters, each of which is the name of ref
   * that was actually updated.
   */
  [Symbol.for('post-update')]() {
    const argv = this.getArgv();

    const updateArray = argv;

    return { updateArray };
  }

  /**
   * @private
   *
   * Its first argument denotes the command it was invoked by: currently one of
   * `amend` or `rebase`. Further command-dependent arguments may be passed in
   * the future.
   *
   * The hook receives a list of the rewritten commits on stdin, in the format:
   * ```
   * <old-sha1> SP <new-sha1> [ SP <extra-info>  ] LF
   * ```
   */
  [Symbol.for('post-rewrite')]() {
    const argv = this.getArgv();

    const command = argv[0];

    const oldSha = argv[1];

    const newSha = argv[2];

    return { command };
  }
}

module.exports = HookParams;
