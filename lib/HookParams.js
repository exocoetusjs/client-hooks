'use strict';

const is = require('is_js');

class HookParams {
  constructor({ args = [], hookName = '' } = {}) {
    this[Symbol.for('args')] = args;
    this[Symbol.for('hookName')] = hookName;

    this[Symbol.for('initParams')]();
  }

  getPluginName() {
    return this[Symbol.for('pluginName')];
  }

  getParams() {
    return this[Symbol.for('params')];
  }

  getArgs() {
    return this[Symbol.for('args')];
  }

  [Symbol.for('initParams')]() {
    const dealArgs = this.getDealArgs();

    const params = is.function(dealArgs) ? dealArgs() : null;

    this[Symbol.for('params')] = params;
  }

  [Symbol.for('getDealArgs')]() {
    const pluginName = this.getPluginName();

    const dealArgs = this[Symbol.for(pluginName)];

    return dealArgs;
  }

  /**
   * @private
   *
   * It takes a single parameter, the name of the file that holds the proposed
   * commit log message.
   */
  [Symbol.for('applypatch-msg')]() {
    const args = this.getArgs();

    const commitMessageFileName = args[0];

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
    const args = this.getArgs();

    const forkBranch = args[0];

    const rebaseBranch = args[1];

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
    const args = this.getArgs();

    const remoteName = args[0];

    const remoteLocation = args[1];

    return { remoteName, remoteLocation };
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
    const args = this.getArgs();

    const updateRef = args[0];

    const oldObjectName = args[1];

    const newObjectName = args[2];

    return { updateRef, oldObjectName, newObjectName };
  }

  /**
   * @private
   *
   * It takes a variable number of parameters, each of which is the name of ref
   * that was actually updated.
   */
  [Symbol.for('post-update')]() {
    const args = this.getArgs();

    const updateArray = args;

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
    const args = this.getArgs();

    const command = args[0];

    return { command };
  }
}
