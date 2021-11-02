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
* We needed to remove `node-config` from the `externals` array of the `webpack.server.config.ts` to make the alias for `config` (which shows to the `config.json` file) work.

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

[ ] ...
