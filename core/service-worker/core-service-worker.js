import { serviceWorker as config } from 'config'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst } from 'workbox-strategies'

let manifestFiles = self.__WB_MANIFEST || []

const precacheAllowList = config?.precacheFiles || []
if (precacheAllowList.length > 0) {
  const allowRegExpList = precacheAllowList.map(string => new RegExp(string, 'gi'))
  manifestFiles = manifestFiles.filter(file => allowRegExpList.some(r => r.test(file.url)))
} else if (precacheAllowList.length === 1 && precacheAllowList[0] === 'none') {
  manifestFiles = []
}

precacheAndRoute(manifestFiles || [])

const assetCache = new CacheFirst({
  cacheName: 'vsf-asset'
})

registerRoute(
  '/',
  assetCache
)

registerRoute(
  /\/c\/.*$/,
  new NetworkFirst()
)

registerRoute(
  /\/p\/.*$/,
  new NetworkFirst()
)

registerRoute(
  /\/(dist|assets)\/.+\.(woff|woff2|eot|ttf|json|svg|png|jpg|jpeg|js|css)$/,
  assetCache
)

registerRoute(
  /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
  assetCache
)

registerRoute(
  /^https:\/\/unpkg\.com\//,
  assetCache
)

registerRoute(
  /^https:\/\/cdn\.jsdelivr\.net\//,
  assetCache
)
