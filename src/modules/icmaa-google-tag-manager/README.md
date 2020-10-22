# `icmaa-google-tag-manager` module

This module contains all functionality for our Google-Tag-Manager (GTM) implementation.

The GTM is by default disabled until the cookie-notice is accepted.  
This can be disabled by the config value: `forceCookieAccept`.

## Add custom page-types to custom routes

Follow these steps to add a custom page-view type:

1. Add the custom page-type as parameter to the routers `meta.gtm` field:
   ```js
   { name: 'service-site', path: '/service-site', component: ServiceSFC, meta: { gtm: 'service-site' } }
   ```
2. Add the page-type to the disallow list in the modules `index.ts`:
   ```js
   export const disallowList = [ 'product', 'category', 'service-site' ]
   ```
4. Add a new event-hook to `hooks/index.ts` like :
   ```js
   const {
     hook: serviceSiteVisitedHook,
     executor: serviceSiteVisitedExecutor
   } = createListenerHook<{ data: any }>()
   
   //...
   
   const IcmaaGoogleTagManagerExecutors = {
     // ..
     serviceSiteVisited: serviceSiteVisitedExecutor
   }
   
   const IcmaaGoogleTagManager = {
     //...
     serviceSiteVisited: serviceSiteVisitedHook
   }
   
   ...
   ```
5. Next, call the executor of this hook inside the `asyncData` method of your router component:
   ```js
   import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'

   async asyncData () {
     IcmaaGoogleTagManagerExecutors.serviceSiteVisited(data)
   }
   ```
6. Add a new `switch-case` clause to the `gtmEventPayload` getter of the Vuex store:
   ```js
   case 'service':
     DTO = {
       event: 'icmaa-service-view',
       ecommerce: {
         //...
       }
     }

     break
   ```
7. Now you need to add a hook into the `registerCustomPageEvents` method of `hooks/afterRegistration.ts`
   ```js
   import { IcmaaGoogleTagManager } from 'icmaa-google-tag-manager/hooks'

   export const registerCustomPageEvents = (config, store: Store<any>) => {
     //...
     IcmaaGoogleTagManager.serviceSiteVisited(() => {
       const event = store.getters['icmaaGoogleTagManager/gtmEventPayload']('service')
       IcmaaGoogleTagManagerExecutors.onGtmPageView({ type: event.event, event })
     })
   }
   ```

## Core changes

We try to overwrite everything needed by extending the Vuex store. But some methods are not highjackable like that – this is a list of core changes.

* We need specific page routes to contain meta fields to recognize the page-type by this field. We need this to deliver different data-layer objects for the GTM page-view event. Thats why we added these fields to the URL objects of `core/modules/url/helpers/transformUrl.ts`.
* We added the `forceServerSilence` parameter to the `CART_ADD_ITEM` mutation and `cart/addItems` action to know when the commit is an user-interaction and when not. This is necessary to not trigger the `icmaa-add-to-cart` GTM event each time a item is added to cart by server (e.g. after login).

## Config

```
{
  ...
  "googleTagManager": {
    "id": "XXX-XXXXXX",
    "debug": false,
    "forceCookieAccept": true,
    "productAttributes": [
      { "field": "id" },
      { "field": "name" },
      ...
    ]
  }
  ...
}
```

## Todo

...

