import config from 'config'
import { assertMethod, useQuery } from 'h3'
import { apiStatus } from '@vue-storefront/core/scripts/server.h3'
import { serverHooks } from '@vue-storefront/core/server/hooks'
import chunk from 'lodash/chunk'

if (config.icmaa_cdn?.cloudflare?.enabled === true) {
  const isProd = process.env.NODE_ENV === 'production'
  const defaults = { baseUrl: '', email: '', authKey: '', zone: '' }
  const { baseUrl, email, authKey, zone } = Object.assign({}, defaults, config.icmaa_cdn?.cloudflare)
  const cfCacheBustUrl = `https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`

  serverHooks.addCacheInvalidatedSubPromise(({ promises, cache, tag, req }) => {
    const cacheKeyPromise = cache.redis.smembers('tags:' + tag)
      .then(pageKeys => {
        const site = req.headers['x-vs-store-code'] as string || 'main'
        const currentKey = `page:${site}:`
        const paths = pageKeys.map(key => key.replace(currentKey, ''))

        const cacheBustRequests = []
        const pathChunks = chunk(paths, 30) // CF has a 30-files-per-request limit
        pathChunks.forEach(chunk => {
        /** @see https://api.cloudflare.com/#zone-purge-files-by-url */
          const batchCacheBust = fetch(cfCacheBustUrl, {
            method: 'DELETE',
            headers: {
              'X-Auth-Email': email,
              'X-Auth-Key': authKey,
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ files: chunk.map(p => baseUrl + p) })
          }).then(res => res.json())
            .catch(e => {
              throw Error('An error during CloudFlare purge appeared. Can\'t render JSON response: ' + e.message)
            })
            .then(res => {
              if (res.errors.length > 0) {
                throw Error('An error during CloudFlare purge appeared: ' + JSON.stringify(res))
              }
              return res
            })

          cacheBustRequests.push(batchCacheBust)
        })

        return Promise.all(cacheBustRequests)
          .then(() => {
            if (!isProd) console.log('CloudFlare-Purge complete for:', pathChunks)
          })
      })
      .catch(err => console.error(err))

    promises.push(cacheKeyPromise)
  })

  serverHooks.afterApplicationInitialized(({ app }) => {
    app.use('/invalidate/all', async (req, res) => {
      assertMethod(req, 'GET')

      if (config.server.useOutputCache) {
        const query = useQuery(req)
        if (!query.key || query.key !== config.server.invalidateCacheKey) { // clear cache pages for specific query tag
          console.error('Invalid cache invalidation key')
          return apiStatus(res, 'Invalid cache invalidation key', 500)
        }
      } else {
        return apiStatus(res, 'Cache invalidation is not required, output cache is disabled')
      }

      return fetch(cfCacheBustUrl, {
        method: 'POST',
        headers: {
          'X-Auth-Email': email,
          'X-Auth-Key': authKey,
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({ purge_everything: true })
      }).then(response => response.json())
        .catch(e => {
          throw Error('An error during CloudFlare purge appeared. Can\'t render JSON response: ' + e.message)
        })
        .then(response => {
          if (response.errors.length > 0) {
            throw Error('An error during CloudFlare purge appeared: ' + JSON.stringify(response))
          }
          return apiStatus(res, 'CloudFlare cache was purged successfully')
        }).catch(error => {
          console.error(error)
          return apiStatus(res, error, 500)
        })
    })
  })
}
