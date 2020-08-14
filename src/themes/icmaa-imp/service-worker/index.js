import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

import { api, storeViews } from 'config'

/*
Service worker extension:

The code will be merged with default Service Worker

Add your own Service worker code here - for example using Google's workbox library:

import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

precacheAndRoute(self.__precacheManifest || self.__WB_MANIFEST || [])

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'my-image-cache',
  })
)

registerRoute(
  /.+\.(css|js|png)$/,
  new NetworkFirst({
    cacheName: 'my-asset-cache',
  })
)
*/

const apiCache = new CacheFirst({
  cacheName: 'vue-sfr-api',
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 60 * 60, // 1h
      purgeOnQuotaError: true
    })
  ]
})

const outputCache = new NetworkFirst({
  cacheName: 'vue-sfr-output',
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 60 * 60 * 24, // 1d
      purgeOnQuotaError: true
    })
  ]
})

const imgCache = new CacheFirst({
  cacheName: 'vue-sfr-img',
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 60 * 60 * 24, // 1d
      purgeOnQuotaError: true
    })
  ]
})

if (storeViews.multistore && storeViews.mapStoreUrlsFor.length > 0) {
  storeViews.mapStoreUrlsFor.forEach(storeCode => {
    registerRoute(
      new RegExp(`^/${storeCode}`),
      outputCache
    )
  })
}

registerRoute(
  /.+\.html$/,
  outputCache
)

registerRoute(
  /^[\w-]+\/*$/,
  outputCache
)

registerRoute(
  new RegExp(`^${api.url}/img/`),
  imgCache
)

registerRoute(
  new RegExp(`^${api.url}/api/(catalog|ext/icmaa-.+)/`),
  apiCache
)
