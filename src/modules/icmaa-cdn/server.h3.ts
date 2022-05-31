import config from 'config'
import { assertMethod, useQuery } from 'h3'
import { apiStatus } from '@vue-storefront/core/scripts/server.h3'
import { serverHooks } from '@vue-storefront/core/server/hooks'
import chunk from 'lodash/chunk'

if (config.icmaa_cdn?.scalecommerce?.fullPageCache?.enabled === true) {
  let { baseUrl, fullPageCache } = config.icmaa_cdn?.scalecommerce
  const { cacheBustHeader } = fullPageCache
  baseUrl = baseUrl.replace(/\/$/gm, '')

  serverHooks.addCacheInvalidatedSubPromise(({ promises, cache, tag, req }) => {
    const cacheKeyPromise = cache.redis.smembers('tags:' + tag)
      .then(pageKeys => {
        const site = req.headers['x-vs-store-code'] as string || 'main'
        const currentKey = `page:${site}:`
        const paths = pageKeys.map(key => key.replace(currentKey, ''))
        const cacheBustRequests = []

        paths.forEach(path => {
          const batchCacheBust = fetch(baseUrl + path, {
            method: 'GET',
            headers: cacheBustHeader
          }).catch(e => {
            throw Error('An error during ScaleCommerce purge appeared: ' + e.message)
          })

          cacheBustRequests.push(batchCacheBust)
        })

        if (paths.length === 0) {
          return Promise.resolve(true)
        }

        return Promise.all(cacheBustRequests)
          .then(() => {
            console.log('ScaleCommerce-Purge complete for:', paths)
          })
      })
      .catch(err => console.error(err))

    promises.push(cacheKeyPromise)
  })
}
