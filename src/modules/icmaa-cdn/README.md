# `icmaa-cdn` module

Load custom image provider to support external CDN services and add Cloudflare cache-bust based on FPC cache-tags.

## Configs

* Run `yarn` to install modules dependencies.  
  They are defined in templates `package.json`.

* `config.images.useExactUrlsNoProxy` must be `true` / enabled 

* Add the following configs to your `config/local.json`:
  ```json
  "images": {
    "useExactUrlsNoProxy": true
  },
  "icmaa_cdn": {
    "provider": "scalecommerce",
    "scalecommerce": {
      "baseUrl": "https://www.base-url.com/",
      "quality": 85
    },
    "cloudflare": {
      "enabled": true,
      "baseUrl": "https://www.impericon.com",
      "email": "XXXXXXXXXX",
      "authKey": "XXXXXXXXXX",
      "zone": "XXXXXXXXXX"
    }
  },
  "purgeConfig": [
    ...
    "icmaa_cdn.cloudflare"
  ]
  ```

## Add a new provider

If you wan't to add another CDN provider, you can add a new class inside the modules `provider/` folder.

You then also need to import the new provider and add it to the `providers` array in the `index.ts` like:
```ts
import scalecommerce from './provider/ScaleCommerce'

const providers: { [provider: string]: ImageHook } = {
  // ...
  scalecommerce
}
```

Then add your desired configs under the `icmaa_cdn` configs path.

> It would be nice to use dynamic-imports for this (as before) but the module registration is synchronous and therefore a dynamic-import can lead into a race condition where the picture component is using the wrong image-path because the cdn provider isn't initialized yet. So we can't lazyload the providers using an import-promise.

## Cloudflare Cache-Control

By default Cloudflare will cache HTML requests if its cache-lifetime is greater or equal to the default CF-TTL.
To be able to still have dynamic cache-busts, we flush the cache for specific pages using a `addCacheInvalidatedSubPromise`-hook to add a cache-bust request based on the paths connected to a cache-tag during cache-invalidation.

It's important to add `icmaa_cdn.cloudflare` to the `purgeConfig` config-parameter to be sure to hide CF credentials for the frontend-response.

## Todo

[ ] ...
