import { addRegexpListToConfig, createRegexpMatcher, flatToRegexpList } from './helpers'

const config = require('config')
const initialResources = addRegexpListToConfig(config)
const dissallowList = [ /\.map$/ ]

const prefetchRegexps = flatToRegexpList(
  initialResources.filter(filterConfig => filterConfig.rel === 'prefetch')
)

/**
 * vue-ssr method that filters prefetch files based on initialResources config
 */
export const shouldPrefetch = (file: string) => {
  const checkRegexpList = createRegexpMatcher(file)

  const matchDissallowList = checkRegexpList(dissallowList)
  if (matchDissallowList) return false

  if (prefetchRegexps.length) {
    const matchFilter = checkRegexpList(prefetchRegexps)

    return matchFilter
  }
  return true
}

const preloadRegexps = flatToRegexpList(
  initialResources.filter(filterConfig => filterConfig.rel === 'preload')
)

/**
 * vue-ssr method that filters preload files based on initialResources config
 */
export const shouldPreload = (file: string) => {
  const checkRegexpList = createRegexpMatcher(file)

  const matchDissallowList = checkRegexpList(dissallowList)
  if (matchDissallowList) return false

  if (preloadRegexps.length) {
    const matchFilter = checkRegexpList(preloadRegexps)

    return matchFilter
  }
  return true
}
