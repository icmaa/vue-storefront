import path from 'path'
import config from 'config'
import TagCache from 'redis-tag-cache'
import { readFileSync } from 'fs'

const initCacheInstance = (c: any, defaultTimeout: number, msg?: string): TagCache | boolean => {
  let cacheKey = ''
  try {
    const cacheVersionPath = path.resolve(path.join('core', 'build', 'cache-version.json'))
    cacheKey = JSON.parse(readFileSync(cacheVersionPath) as any) + ':'
  } catch (err) {
    if (err.code !== 'ENOENT') console.error(err)
  }

  const redisConfig = Object.assign({}, c, { keyPrefix: cacheKey })
  console.log(msg || 'Initialized output-cache with:', JSON.stringify(redisConfig))

  return new TagCache({
    redis: redisConfig,
    defaultTimeout
  })
}

let cache: TagCache | boolean = false
const outputCacheTtl: number = config.server.outputCacheDefaultTtl

if (config.server.useOutputCache) {
  cache = initCacheInstance(config.redis, outputCacheTtl)
}

let tagCache: TagCache | boolean = false
const tagCacheTtl: number = config.server.tagCacheDefaultTtl || outputCacheTtl

if (config.server.useOutputCacheTagging) {
  const tagCacheConfig = Object.assign({}, config.redis, config.redisTagCache || {})
  if (config.redis.db !== tagCacheConfig.db) {
    tagCache = initCacheInstance(tagCacheConfig, tagCacheTtl, 'Initialized tag-cache with')
  }
}

export { tagCache }

export default cache
