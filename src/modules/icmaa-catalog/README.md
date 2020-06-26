# `icmaa-catalog` module

Add our custom functionality for the original `catalog` and `catalog-next` module.

## Config

```
...
"icmaa_catalog": {
  "entities": {
    "category": {
      "configureChildProductsInCategoryList": false,
      "customSortByAttributes": []
    },
    "product": {
      "calculateBundledPriceByChildren": false
    },
    "productListTicket": {
      "parentCategoryWhitelist": [],
      "includeFields": [
        "band", 
        "ticket_eventdate", 
        "ticket_start", 
        "ticket_venue", 
        "ticket_city",
        "ticket_endofsale"
      ]
    }
  }
}
```

### Filters

There are some new filter options to setup our filter logic. To find out what they are doing, look at the categore sidebar component in the theme.
```
...
  "systemFilterNames": ["sort", "pagesize"],
  "defaultFilters": [
    "price",
    "size",
    "type_top",
    "type_shoes_height",
    "type_top_sleeve",
    ...
  ],
  "filterTree": {
    "band": [], "brand": [],
    "type_top": ["type_top_sleeve", "type_top_printtyp", "type_top_jackets", "type_top_cut", "type_jackets_lenght", "type_shirt_pattern"],
    ...
  },
  "submenuFilters": ["band", "brand", ... ],
  "singleOptionFilters": ["is_in_sale", "preorder"],
  "filterTypeMapping": {
    "color": ["color"],
    "gender": ["gender"],
    "price": ["price"],
    "sale": ["is_in_sale"],
    "list": ["type_top", "type_shoes_height", ... ],
    "searchableList": ["band", "brand"]
  },
```

## Core changes

We try to overwrite everything needed by extending the Vuex store. But some methods are not highjackable like that – this is a list of core changes.

* We uncommented the original lines in `core/modules/catalog/index.ts` to prevent original preloading and replace it by our, following routing. See comments in the `./index.ts` for more infos
* We added a custom mutator-event called `afterSelectedVariant` in `core/modules/catalog/helpers/variant/getSelectedVariant.ts` to mutate the `selectedVariant` object. We do this to fix a bug which occurs if you switch between differen configurable options in PDP.
* We commented out the stock-filter based on `listOutOfStockProducts` config value in `buildQuery` method of `core/modules/catalog/helpers/associatedProducts/buildQuery.ts` – otherwise a sold-out associated product wouldn't be visible in the selection sidebar and might cause an `property of undefined` error

## Todo

[ ] ...
