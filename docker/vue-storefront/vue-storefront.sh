#!/bin/sh
set -e

yarn install || exit $?

if [ ! -f "./config/custom-environment-variables.json" ]; then
  config-sync -r vue-storefront -d ./
fi

if [ "$NODE_CONFIG_ENV" = 'development' ]; then
  yarn dev
else
  yarn build || exit $?
  yarn start
fi
