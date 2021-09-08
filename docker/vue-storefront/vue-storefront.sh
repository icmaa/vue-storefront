#!/bin/sh
set -e

yarn install || exit $?

if [ "$NODE_CONFIG_ENV" = 'development' ]; then
  yarn dev
else
  yarn build || exit $?
  yarn start
fi
