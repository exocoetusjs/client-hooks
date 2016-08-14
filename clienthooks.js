/*******************************************************************************
*           _  _               _          _                    _               *
*      ___ | |(_)  ___  _ __  | |_       | |__    ___    ___  | | __ ___       *
*     / __|| || | / _ \| '_ \ | __| ____ | '_ \  / _ \  / _ \ | |/ // __|      *
*    | (__ | || ||  __/| | | || |_ |____|| | | || (_) || (_) ||   < \__ \      *
*     \___||_||_| \___||_| |_| \__|      |_| |_| \___/  \___/ |_|\_\|___/      *
*                                                                              *
*******************************************************************************/
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
  'pre-applypatch': [],
  /**
   * ## POST-APPLYPATCH
   *
   * This hook is invoked by `git am`. It takes no parameter, and is invoked
   * after the patch is applied and a commit is made.
   *
   * [More Detail](https://git-scm.com/docs/githooks#post-applypatch)
   */
  'post-applypatch': [],
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
   * ## PREPARE-COMMIT-MSG
   *
   * This hook is invoked by git commit right after preparing the default log
   * message, and before the editor is started.
   *
   * [More Detail](https://git-scm.com/docs/githooks#pre-commit-msg)
  */
  'prepare-commit-msg': [],
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
   * ## POST-COMMIT
   *
   * This hook is invoked by `git commit`. It takes no parameter, and is invoked
   * after a commit is made.
   *
   * [More Detail](https://git-scm.com/docs/githooks#post-commit)
  */
  'post-commit': [],
  /**
   * ## PRE-REBASE
   *
   * This hook is called by `git rebase` and can be used to prevent a branch from
   * getting rebased. The hook may be called with one or two parameters. The
   * first parameter is the upstream from which the series was forked. The second
   * parameter is the branch being rebased, and is not set when rebasing the
   * current branch.
   *
   * [More Detail](https://git-scm.com/docs/githooks#pre-rebase)
  */
  'pre-rebase': [],
  /**
   * ## POST-CHECKOUT
   *
   * This hook is invoked when a `git checkout` is run after having updated the
   * worktree. The hook is given three parameters: the ref of the previous `HEAD`,
   * the ref of the new `HEAD` (which may or may not have changed), and a flag
   * indicating whether the checkout was a branch checkout (changing branches,
   * flag=1) or a file checkout (retrieving a file from the index, flag=0). This
   * hook cannot affect the outcome of `git checkout`.
   *
   * [More Detail](https://git-scm.com/docs/githooks#post-checkout)
  */
  'post-checkout': [],
  /**
   * ## POST-MERGE
   *
   * This hook is invoked by `git merge`, which happens when a `git pull` is done
   * on a local repository. The hook takes a single parameter, a status flag
   * specifying whether or not the merge being done was a squash merge. This hook
   * cannot affect the outcome of git merge and is not executed, if the merge
   * failed due to conflicts.
   *
   * [More Detail](https://git-scm.com/docs/githooks#post-merge)
  */
  'post-merge': [],
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
   * ## POST-REWRITE
   *
   * This hook is invoked by commands that rewrite commits (`git commit --amend`,
   * git-rebase; currently git-filter-branch does not call it!). Its first argument
   * denotes the command it was invoked by: currently one of amend or rebase.
   * Further command-dependent arguments may be passed in the future.
   *
   * [More Detail](https://git-scm.com/docs/githooks#post-rewrite)
  */
  'post-rewrite': [],
  /**
   * ## PRE-AUTO-GC
   *
   * This hook is invoked by `git gc --auto`. It takes no parameter, and exiting
   * with non-zero status from this script causes the `git gc --auto` to abort.
   *
   * [More Detail](https://git-scm.com/docs/githooks#pre-auto-gc)
  */
 'pre-auto-gc': [],
};
