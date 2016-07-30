#!/bin/bash

if ! which node > /dev/null ; then
  printf "Please install [nodejs] first."
fi

if ! which npm > /dev/null ; then
  printf "Please install [npm] first."
fi

if ! which gulp > /dev/null ; then
  printf "Please install [gulp] first."
fi

if [[ ! -f "package.json" ]]; then
  npm init --yes
else
  npm config set cwd $WORK_DIR
fi

# Install gulp-eslint denpendencies
if ! npm ls --depth=0 gulp | grep gulp; then
  npm install --save-dev gulp
fi

if ! npm ls --depth=0 gulp-eslint | grep gulp; then
  npm install --save-dev gulp-eslint
fi

# Install eslint-config-airbnb
if ! npm ls --depth=0 eslint-config-airbnb | grep eslint-config-airbnb; then
  npm install --save-dev eslint-config-airbnb eslint-plugin-import \
    eslint-plugin-react eslint-plugin-jsx-a11y eslint
fi

# run eslint-es6 task
gulp eslint-es6 --gulpfile "${PLUGIN}/gulpfile.js"
