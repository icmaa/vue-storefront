import config from 'config'
import { serverHooks } from '@vue-storefront/core/server/hooks'
import chunk from 'lodash/chunk'

if (config.icmaa_cdn?.cloudflare?.enabled === true) {
  const defaults = { baseUrl: '', email: '', authKey: '', zone: '' }
  const { baseUrl, email, authKey, zone } = Object.assign({}, defaults, config.icmaa_cdn?.cloudflare)
  const isProd = process.env.NODE_ENV === 'production'

  serverHooks.addCacheInvalidatedSubPromise(({ promises, cache, tag, req }) => {
    const cacheKeyPromise = cache.redis.smembers('tags:' + tag)
      .then(pageKeys => {
        const cacheBustRequests = []
        const cfCacheBustUrl = `https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`

        const site = req.headers['x-vs-store-code'] as string || 'main'
        const currentKey = `page:${site}:`
        const paths = pageKeys.map(key => key.replace(currentKey, ''))

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
          }).then(res => res.json()).then(res => {
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
}
