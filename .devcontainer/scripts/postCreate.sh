#!/bin/bash

git clone https://github.com/icmaa/shop-workspace.git -b develop
yarn --cwd shop-workspace
yarn --cwd shop-workspace dev:sync --no-api --no-magento --sync-dest ../
sudo rm -r shop-workspace

yarn install
