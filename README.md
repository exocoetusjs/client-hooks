# client-hooks [![NPM version][npm-version]][npm-url][![GitHub issues][github-issue]][issue-url][![GitHub forks][github-forks]][fork-url][![GitHub stars][github-star]][star-url]

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

client-hooks is released under [MIT License](https://github.com/crux-wild/client-hooks/blob/master/LICENSE)

[npm-url]: https://www.npmjs.com/package/client-hooks
[npm-version]: https://badge.fury.io/js/client-hooks.svg

[issue-url]: https://github.com/crux-wild/client-hooks/issues
[github-issue]: https://img.shields.io/github/issues/crux-wild/client-hooks.svg

[fork-url]: https://github.com/crux-wild/client-hooks/network
[github-forks]: https://img.shields.io/github/forks/crux-wild/client-hooks.svg

[star-url]: https://github.com/crux-wild/client-hooks/stargazers
[github-star]: https://img.shields.io/github/stars/crux-wild/client-hooks.svg
