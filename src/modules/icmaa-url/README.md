# `icmaa-url` module

Set mappings for specific routes to enable custom routes and urls.
Also add an auto-redirect to default stores for url's without a store-code in it.

## Dynamic CMS url-mappping

This is how we achieve to get all matching CMS pages with a single request during the VSF url-resolution.

To map pages during the url-resolution that are comming from our CMS enpoint, you need to add them to the `icmaa.cmsTypeMap` config-map.
That way you can connect a specific component/content-type from the CMS with the state-management of the related module.

The related Vuex storage should have an `ADD` mutation (called the same way) and can have a getter called `getRouteByIdentifier` to add custom logic to the returned custom-route. For example in `icmaa-competitions` where we check if the competition is enabled:
```typescript
{
  // ...
  getRouteByIdentifier: (state, getter) => (identifier: string): Record<string, any> => {
    const competition = getter.getByIdentifier(identifier)
    if (competition !== null && competition.enabled === true) {
      return {
        name: 'icmaa-competition',
        params: { identifier }
      }
    }
  }
  // ...
}
```

If no `getRouteByIdentifier` getter is defined a default route like `{ name: `icmaa-cms-${component}`, params: { identifier } }` is composed.

To overwrite active categories or products using the CMS you can add the specific url-path to the `icmaa_url.catalogOverwrites` config.
This way VSF knows there is a CMS page for this path and checks the CMS resolution – if none found it will try to resolve the major catalog entities as usual. If we change the order of the url-resolution the VSF would make a request to the CMS api for each product or category just in case there is an overwrite – this would increase the network traffic and response time.

## Static url-mapping

For static url's you can use the `icmaa_url.custom` config node to add fixed router-configs or rewrites (see [configs-section](#configs) for examples).

## Configs

You can add your mappings to the `config/local.json`:

```
  …
  "icmaa_url": {
    "cmsTypeMap": {
      "page": "icmaaCmsPage",
      "landing-page": "icmaaCmsLandingPages",
      "competition": "icmaaCompetitions"
    }
    "catalogOverwrites": {
      "fashion.html": [ "fashion", "streetwear" ],
      "cms-identifier.html": [ "alias-1.html", "alias-2" ],
      ...
    },
    "custom": [
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
      }
    ],
    ...
  }
```

## Core changes

We try to overwrite everything needed by extending the Vuex store. But some methods are not highjackable like that – this is a list of core changes.

* The `RouterManager` has a priority option which won't work properly. Thats why we needed to overwrite the `addRoutesByPriority` method of `core/lib/router-manager.ts` to have a correct order of the routes depending on their priority.

## Todo

[ ] Make config via `icmaa-cms` available
