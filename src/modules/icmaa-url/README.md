# `icmaa-url` module

Set mappings for specific routes to enable custom routes and urls.
Also add an auto-redirect to default stores for url's without a store-code in it.

## Configs

You can add your mappings to the `config/local.json`:

```
  …
  "icmaa_url": [
    {
      "request_path": "new",
      "name": "category",
      "params": {
        "slug": "new"
      }
    },
    {
      "request_path": "streetwear",
      "name": "icmaa-category-list",
      "params": {
        "parentCategoryId": 14
      }
    },
    {
      "request_path": "merchandise",
      "name": "icmaa-category-list",
      "params": {
        "parentCategoryId": 16,
        "depth": 2
      }
    }
  ],
```

## Core changes

We try to overwrite everything needed by extending the Vuex store. But some methods are not highjackable like that – this is a list of core changes.

* The `RouterManager` has a priority option which won't work properly. Thats why we needed to overwrite the `addRoutesByPriority` method of `core/lib/router-manager.ts` to have a correct order of the routes depending on their priority.

## Todo

[ ] Make config via `icmaa-cms` available
