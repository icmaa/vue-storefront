#!/bin/bash

git clone https://github.com/icmaa/shop-workspace.git -b develop
yarn --cwd shop-workspace
yarn --cwd shop-workspace dev:sync --no-api --no-magento --sync-dest ../
rm -r shop-workspace

# Install NodeJS 16 as it comes with LTS by default
nvm install 16
nvm use --delete-prefix v16.9.0
