/**
 *******************************************************************************
 **          _  _               _          _                    _             **
 **         | |(_)             | |        | |                  | |            **
 **     ___ | | _   ___  _ __  | |_  ____ | |__    ___    ___  | | __  ___    **
 **    / __|| || | / _ \| '_ \ | __||____|| '_ \  / _ \  / _ \ | |/ / / __|   **
 **   | (__ | || ||  __/| | | || |_       | | | || (_) || (_) ||   <  \__ \   **
 **    \___||_||_| \___||_| |_| \__|      |_| |_| \___/  \___/ |_|\_\ |___/   **
 **                                                                           **
 *******************************************************************************
 */
module.exports = {
  /**
   * ## APPLYPATCH_MSG
   *
   * This hook is invoked by git am script. It takes a single parameter, the
   * name of the file that holds the proposed commit log message. Exiting with
   * non-zero status causes git am to abort before applying the patch.
   *
   * [More Detail](https://git-scm.com/docs/githooks#applypatch-msg)
   */
  'applypath-msg': [],
  /**
   * ## COMMIT-MSG
   *
   * This hook is invoked by `git commit`, and can be bypassed with
   * `--no-verify` option. It takes a single parameter, the name of the file
   * that holds the proposed commit log message. Exiting with non-zero status
   * causes the git commit to abort.
   *
   * [More Detail](https://git-scm.com/docs/githooks#commit-msg)
  */
  'commit-msg': [],
  /**
   * ## PRE-APPLYPATCH
   *
   * This hook is invoked by `git am`. It takes no parameter, and is invoked
   * after the patch is applied, but before a commit is made.
   *
   * If it exits with non-zero status, then the working tree will not be
   * committed after applying the patch.
   *
   * [More Detail](https://git-scm.com/docs/githooks#pre-applypatch)
   */
  'pre-applypath': [],
  /**
   * ## PRE-COMMIT
   *
   * This hook is invoked by git commit, and can be bypassed with `--no-verify`
   * option. It takes no parameter, and is invoked before obtaining the proposed
   * commit log message and making a commit. Exiting with non-zero status from
   * this script causes the git commit to abort.
   *
   * [More Detail](https://git-scm.com/docs/githooks#pre-commit)
  */
  'pre-commit': [],
  /**
   * ## PRE-PUSH
   *
   * This hook is called by git push and can be used to prevent a push from taking
   * place. The hook is called with two parameters which provide the name and
   * location of the destination remote, if a named remote is not being used both
   * values will be the same.
   *
   * [More Detail](https://git-scm.com/docs/githooks#pre-push)
  */
  'pre-push': [],
  /**
   * ## PRE-REBASE
   *
   * This hook is called by `git rebase` and can be used to prevent a branch from
   * getting rebased. The hook may be called with one or two parameters. The first
   * parameter is the upstream from which the series was forked. The second
   * parameter is the branch being rebased, and is not set when rebasing the
   * current branch.
   *
   * [More Detail](https://git-scm.com/docs/githooks#pre-rebase)
  */
  'pre-rebase': [],
  /**
   * ## PREPARE-COMMIT-MSG**
   *
   * This hook is invoked by git commit right after preparing the default log
   * message, and before the editor is started.
   *
   * [More Detail](https://git-scm.com/docs/githooks#pre-commit-msg)
  */
  'prepare-commit-msg': []
};
