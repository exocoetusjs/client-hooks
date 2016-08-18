## client-hooks

[![NPM version][npm-version]][npm-url] [![Crates.io][download-rate]][npm-url] [![GitHub license][license]][license-url]

<img style="float: right;" width="320" src="https://raw.githubusercontent.com/clienthooksjs/artwork/master/client-hooks-logo.png" alt="">

**Explanation:** a flying fish in the calm sea in the sky...

## Brief Introduction

<a href="https://asciinema.org/a/82511" target="_blank"><img src="https://asciinema.org/a/82511.png" width="589"/></a>

## Features

client-hooks is a plugin-based client hooks management.

- **High performance:** `client-hooks` introduce competition meachanism.
  parallel execution plugin, once any of plugin error occurred, immediately
  locate the problem.

- **Automation:** no manulal run command. configuration tasks will be automation
  executed by `git`.

- **Plugin-based:** `client-hooks` merely provides a core mechanism. you can
  expand its functionality in the form of custome plugins.

- **Simple:** through plugin encapsulate complex logic inside. for `git`
  repository manager, only need care current repository what features are
  required.

## Getting Started

### Prerequisites

- The installation directory need is a `git` repository.
- Current system install [Git](https://git-scm.com) (version >= `2.9.0`).
- Current system install [Node](https://nodejs.org) (version >= `6.3.1`).

### Basci Installation

```bash
npm install --save-dev client-hooks
```

## Thanks

**Special thanks to the generous sponsorship by:**

<a href="https://www.jimu.com">
  <img width="200px" src="https://page.jimu.com/content-dist/images/default/logo.png">
</a>

<a href="https://merak.jimu.com">
  <img src="https://merak.jimu.com/content-dist/images/common/logo_colored-f66042201f.png">
</a>

support the completion of the project team can not be separated.

## Contribute

### License

client-hooks is released under [MIT License](https://github.com/crux-wild/client-hooks/blob/master/LICENSE).
[npm-url]: https://www.npmjs.com/package/client-hooks
[download-rate]: https://img.shields.io/crates/d/rustc-serialize.svg?maxAge=2592000
[npm-version]: https://badge.fury.io/js/client-hooks.svg
[license-url]:https://raw.githubusercontent.com/clienthooksjs/client-hooks/master/LICENSE
[license]: https://img.shields.io/badge/license-MIT-blue.svg
