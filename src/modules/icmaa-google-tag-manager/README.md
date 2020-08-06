# `icmaa-google-tag-manager` module

This module contains all functionality for our Google-Tag-Manager (GTM) implementation.

The GTM is by default disabled until the cookie-notice is accepted.  
This can be disabled by the config value: `forceCookieAccept`.

## Add custom page-types to custom routes

Follow these steps to add a custom page-view type:

1. Add a new event-hook to `hooks/index.ts` like :
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
2. Next, call the executor of this hook inside the `asyncData` method of your router component:
   ```js
   import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'

   async asyncData () {
     IcmaaGoogleTagManagerExecutors.serviceSiteVisited(data)
   }
   ```
3. Add a new `switch-case` clause to the `gtmEventPayload` getter of the Vuex store:
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
4. Now you need to add a hook into the `registerCustomPageEvents` method of `hooks/afterRegistration.ts`
   ```js
   import { IcmaaGoogleTagManager } from 'icmaa-google-tag-manager/hooks'

   export const registerCustomPageEvents = (config, store: Store<any>) => {
     //...
     IcmaaGoogleTagManager.serviceSiteVisited(() => {
       const eventPayload = store.getters['icmaaGoogleTagManager/gtmEventPayload']('service')
        store.dispatch('icmaaGoogleTagManager/updateEvent', eventPayload)
     })
   }
   ```

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

