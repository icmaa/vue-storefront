import config from 'config'
import { LocalizedRoute } from '@vue-storefront/core/lib/types'
import { localizedDispatcherRoute, localizedRoute, removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import has from 'lodash-es/has'

/**
 * This is for CMS url's that should overwrite major entity url's like products/categories.
 * Otherwise we would need to check the CMS api before each product-/category-request.
 */
export const isCatalogOverwrite = (urlPath: string): string => {
  if (has(config, 'icmaa_url.catalogOverwrites')) {
    const { catalogOverwrites: overwrites } = config.icmaa_url
    const overwrite = Object.entries<string[]>(overwrites)
      .find(([path, aliases]) => path === urlPath || aliases.includes(urlPath))
    return overwrite ? overwrite.shift() as string : undefined
  }
  return undefined
}

export function removeHashFromRoute (matchedRouteOrUrl: LocalizedRoute | string): LocalizedRoute | string {
  let urlPath = typeof matchedRouteOrUrl === 'object' ? matchedRouteOrUrl.path : matchedRouteOrUrl
  return urlPath.replace(/#.*$/m, '')
}

export const getUrlPathFromUrl = (url): string => {
  if (url.startsWith('/')) url = url.slice(1)
  if (url.endsWith('/')) url = url.slice(0, -1)
  url = removeStoreCodeFromRoute(url) as string
  url = removeHashFromRoute(url) as string
  return url
}

/**
 * Copy of @vue-storefront/core/modules/url/helpers/index.ts
 * but with an option to leave childSku out of URL.
 * @param product
 * @param storeCode
 */
export function formatProductLink (
  product: {
    parentSku?: string,
    sku: string,
    url_path?: string,
    type_id: string,
    slug: string,
    options?: [],
    configurable_children?: []
  },
  storeCode,
  showChildSku: boolean = false
): string | LocalizedRoute {
  if (config.seo.useUrlDispatcher && product.url_path) {
    let routeData: LocalizedRoute
    if (showChildSku && ((product.options && product.options.length > 0) || (product.configurable_children && product.configurable_children.length > 0))) {
      routeData = {
        path: product.url_path,
        params: { childSku: product.sku }
      }
    } else {
      routeData = { path: product.url_path }
    }
    return localizedDispatcherRoute(routeData, storeCode)
  } else {
    const routeData: LocalizedRoute = {
      name: product.type_id + '-product',
      params: {
        parentSku: product.parentSku ? product.parentSku : product.sku,
        slug: product.slug
      }
    }

    if (showChildSku) {
      routeData.params.childSku = product.sku
    }

    return localizedRoute(routeData, storeCode)
  }
}
