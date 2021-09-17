# `icmaa-config` module

Load config files per store view using a custom config-extension to make the config files more readable for a big amount of store-views.

We extended the `core/scripts/generate-files.ts` script to search for `src/modules/**/config.ts` files and extend the standard `npm-config` by their output. This way we don't need to traverse the configs on runtime and only have the workload once during the build.

The custom config-method searches in the config folder for files like `local-imp-storeview-de.json` and extends the specific store view setting of the store by the content of this file.

The files are structured similar to the `npm-config` module, like:
```
local-${mandant}-storeview-${store-code}.json
```

This module also put the current `process.env.__BUILDTIME__` into local-storage and force a flush if it isn't sync anymore. This way we can force a new load of specific data into local-storage with each new build. Items in local-storage that should be protected from flush, must be added to the `localStorageBuildFlushWhitelist` config array in `icmaa_config` config node (can be a RegExp).

## Further explanation

The VSF uses the `node-config` package and it's [recommended approach for universal applications](https://github.com/lorenwest/node-config/wiki/Webpack-Usage). That's why we are able to just extend the output JSON file during the build. Webpack then creates an alias for `config` imports to load the generated JSON instead of the `node-config` library.

## Core changes

We try to overwrite everything needed by extending the Vuex store. But some methods are not highjackable like that – this is a list of core changes.

* Add the following lines to the top of the `core/scripts/generate-files.ts` script to enable the custom-config import:
  ```ts
  import extendConfigs from 'icmaa-config/extendConfigs'
  extendConfigs()
  ``` 

## Installation

First enable `server.dynamicConfigReload` in your settings.

For `v1.11.0` and above:
*  Add the custom `configProvider` to the `src/ modules/server.ts` file like:
   ```javascript
   export const configProvider = require('icmaa-config      configProvider')
   ```

For `v1.10.x`:  
* Add the custom `configProvider` to the `src/server/index.js` file like:
  ```javascript
  module.exports.registerUserServerRoutes = require('icmaa-config/    configProvider')
  ```

## Configs

* Add the following configs to your `config/local.json`:
  ```
  {
    "icmaa_config": {
      "localStorageBuildFlushWhitelist": [
        "cart", "user", "anything\-.*"
      ]
    }
  }
  ```

## Todo

[ ] Remove `module-alias` dependency. We only need it in `core/scripts/server.ts` to define an alias for `config` imports on SSR as the `config` webpack-alias isn't working anyhow.
