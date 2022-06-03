import config from 'config'
import { assertMethod, useQuery } from 'h3'
import { apiStatus } from '@vue-storefront/core/scripts/server.h3'
import { serverHooks } from '@vue-storefront/core/server/hooks'
import cache from '@vue-storefront/core/scripts/utils/cache-instance'
import uniq from 'lodash/uniq'

serverHooks.afterApplicationInitialized(({ app }) => {
  app.use('/cache-tag-urls', async (req, res) => {
    assertMethod(req, 'GET')
    const query = useQuery(req)

    if (config.server.useOutputCache) {
      if (!query.key || query.key !== config.server.invalidateCacheKey) { // clear cache pages for specific query tag
        console.error('Invalid cache invalidation key')
        return apiStatus(res, 'Invalid cache invalidation key', 500)
      }
    } else {
      return apiStatus(res, 'Cache invalidation is not required, output cache is disabled')
    }

    const paths = []
    const pathPromises = []
    const tags = uniq((query.tag as string).split(','))

    if (tags.length > 15) {
      return apiStatus(res, 'Please fetch only 15 tags at once.', 500)
    }

    const site = req.headers['x-vs-store-code'] as string || 'main'
    const currentKey = `page:${site}:`

    tags.forEach(tag => {
      if (!config.server.availableCacheTags.find(t => t === tag || tag.indexOf(t) === 0)) {
        pathPromises.push(Promise.reject(`Invalid tag name ${tag}`))
        return
      }

      const tagMemberPromis = cache.redis.smembers('tags:' + tag)
        .then(pageKeys => {
          paths.push(...pageKeys.map(k => k.replace(currentKey, '')))
        })

      pathPromises.push(tagMemberPromis)
    })

    return Promise.all(pathPromises)
      .then(() => {
        return apiStatus(res, uniq(paths.sort()))
      }).catch(err => {
        return apiStatus(res, err, 500)
      })
  })
})
