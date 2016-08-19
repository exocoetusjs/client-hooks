/*******************************************************************************
*                                           _                 _                *
*         ___  ___ _ ____   _____ _ __     | |__   ___   ___ | | _____         *
*        / __|/ _ \ '__\ \ / / _ \ '__|____| '_ \ / _ \ / _ \| |/ / __|        *
*        \__ \  __/ |   \ V /  __/ | |_____| | | | (_) | (_) |   <\__ \        *
*        |___/\___|_|    \_/ \___|_|       |_| |_|\___/ \___/|_|\_\___/        *
*                                                                              *
*******************************************************************************/
module.exports = {
  'namespace': 'server-hooks',
  /**
   * ## UPDATE
   *
   * This hook is invoked by git-receive-pack on the remote repository, which
   * happens when a `git push` is done on a local repository. Just before updating
   * the ref on the remote repository, the update hook is invoked. Its exit status
   * determines the success or failure of the ref update.
   *
   * [More detail](https://git-scm.com/docs/githooks#update)
   */
  'update': [],
  /**
   * ## POST-RECEIVE
   *
   * This hook is invoked by git-receive-pack on the remote repository, which
   * happens when a git push is done on a local repository. It executes on the
   * remote repository once after all the refs have been updated.
   *
   * [More detail](https://git-scm.com/docs/githooks#pre-receive)
   */
  'post-receive': [],

  /**
   * ## POST-UPADTE
   *
   * This hook is invoked by git-receive-pack on the remote repository, which
   * happens when a git push is done on a local repository. It executes on the
   * remote repository once after all the refs have been updated.
   *
   * [More detail](https://git-scm.com/docs/githooks#pre-update)
   */
  'post-update': [],
};
