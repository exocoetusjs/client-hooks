class HooksProcess {
  constructor(...plugins) {
    for (let plugins of plugins) {
      // @TODO: Traversing the plugin list of this hook.
    }
  }

  getPathByPluginName() {
    // @TODO: Get plugin main script path by pluginName
  }

  getAnyRejectPromise(...promises) {
    let anyRejectPromise = new Promise((fulfillOuter, rejectOuter) => {
      for (let promise of Promises) {
        promise.reject((error) => {
          rejectOuter(error);
        });
      }
    });
    return anyRejectPromise;
  }
}
