#!/bin/sh
set -e

if [ "$NODE_CONFIG_ENV" = 'development' ]; then
  yarn dev
else
  yarn build || exit $?
  yarn start
fi
