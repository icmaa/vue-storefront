import config from 'config'
import CmsService from 'icmaa-cms/data-resolver/CmsService'
import { ActionTree } from 'vuex'
import { UrlState } from '@vue-storefront/core/modules/url/types/UrlState'
import { removeStoreCodeFromRoute, currentStoreView, localizedDispatcherRouteName } from '@vue-storefront/core/lib/multistore'
import { removeHashFromRoute } from '../helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

import has from 'lodash-es/has'

interface UrlMapperOptions {
  urlPath: string,
  params: Record<string, any>
}

const getUrlPathFromUrl = (url): string => {
  if (url.startsWith('/')) url = url.slice(1)
  if (url.endsWith('/')) url = url.slice(0, -1)
  url = removeStoreCodeFromRoute(url) as string
  url = removeHashFromRoute(url) as string
  return url
}

const getLocalizedDispatcherRouteName = (name) => {
  const { storeCode, appendStoreCode } = currentStoreView()
  return localizedDispatcherRouteName(name, storeCode, appendStoreCode)
}

/**
 * This is our custom url fallback mapper for custom urls
 */
const customUrls = async ({ urlPath }: UrlMapperOptions) => {
  if (has(config, 'icmaa_url.custom')) {
    let urlFromConfig = config.icmaa_url.custom.find(item => item.request_path === urlPath)
    if (urlFromConfig) {
      delete urlFromConfig.request_path
      return urlFromConfig
    }
  }

  return undefined
}

/**
 * This is for CMS url's that should overwrite major entity url's like products/categories.
 * Otherwise we would need to check the CMS api before each product-/category-request.
 */
const isCmsOverwrite = (urlPath: string): string => {
  if (has(config, 'icmaa_url.cmsOverwrites')) {
    const rewrite = config.icmaa_url.cmsOverwrites
      .find(p => typeof p === 'object' ? Object.keys(p).includes(urlPath) : p === urlPath)
    return typeof rewrite === 'object' ? Object.values(rewrite).pop() : rewrite
  }
  return undefined
}

export const actions: ActionTree<UrlState, any> = {
  async mapCmsUrls ({ commit, rootGetters }, { urlPath }: UrlMapperOptions) {
    const { cmsTypeMap: typeMap } = config.icmaa_url

    return CmsService
      .single({ documentType: Object.keys(typeMap).join(','), uid: urlPath })
      .then((payload: any) => {
        if (payload !== null && Object.values(payload).length > 0 && typeMap[payload.component]) {
          const { component, identifier } = payload
          const stateKey = typeMap[component]

          commit(`${stateKey}/ADD`, payload, { root: true })

          let route
          try {
            route = rootGetters[`${stateKey}/getRouteByIdentifier`](urlPath)
            if (!route) {
              throw Error(`No getter found: ${stateKey}/getRouteByIdentifier`)
            }
          } catch (err) {
            route = {
              name: `icmaa-cms-${component}`,
              params: { identifier }
            }
          }

          route.name = getLocalizedDispatcherRouteName(route.name)

          return route
        }

        return undefined
      })
      .catch(() => undefined)
  },
  async mapFallbackUrl ({ dispatch }, { url, params }: { url: string, params: any }) {
    const urlPath = getUrlPathFromUrl(url)
    const paramsObj = { urlPath, params }

    const customUrl = await customUrls(paramsObj)
    if (customUrl) {
      return customUrl
    }

    const isOverwrite = isCmsOverwrite(urlPath)
    if (isOverwrite) {
      paramsObj.urlPath = isOverwrite
      const cmsPageUrl = await dispatch('mapCmsUrls', paramsObj)
      if (cmsPageUrl) {
        return cmsPageUrl
      }
    }

    // This is the code of VSF
    const fallbackData = await dispatch('getFallbackByUrl', { url: urlPath, params })
    if (fallbackData) {
      const [result] = await Promise.all([
        dispatch('transformFallback', { ...fallbackData, params }),
        dispatch('saveFallbackData', fallbackData)
      ])
      return result
    }

    const cmsPageUrl = await dispatch('mapCmsUrls', paramsObj)
    if (cmsPageUrl) {
      return cmsPageUrl
    }

    Logger.error('No route found for:', 'icmaa-url', url)()

    return {
      name: 'page-not-found',
      params: {
        slug: 'page-not-found'
      }
    }
  }
}
