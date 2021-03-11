import config from 'config'
import CmsService from 'icmaa-cms/data-resolver/CmsService'
import { ActionTree } from 'vuex'
import { UrlState } from '@vue-storefront/core/modules/url/types/UrlState'
import { currentStoreView, localizedDispatcherRouteName } from '@vue-storefront/core/lib/multistore'
import { getUrlPathFromUrl, isCatalogOverwrite } from '../helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

import has from 'lodash-es/has'

interface UrlMapperOptions {
  urlPath: string,
  params: Record<string, any>
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

    const isOverwrite = isCatalogOverwrite(urlPath)
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

    Logger.error('No route found for:', 'icmaa-url', { url, params })()

    return {
      name: 'page-not-found',
      params: {
        slug: 'page-not-found'
      }
    }
  }
}
