import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore, isServer } from '@vue-storefront/core/helpers'

import { IcmaaExtendedAttributeStore } from './store/attribute'
import { IcmaaExtendedCategoryStore } from './store/category'
import { IcmaaExtendedProductStore } from './store/product'
import { IcmaaBreadcrumbsStore } from './store/breadcrumbs'
import { SearchAliasStore, stateKey } from './store/search-alias'
import { icmaaCatalogHooks } from './hooks'
import { routerHelper, initBrowserBackEvent } from 'icmaa-catalog/helpers/popState'

import config, { products, entities } from 'config'

import uniq from 'lodash-es/uniq'
import pick from 'lodash-es/pick'

// This inits the popstate event-binding
// and Vue.observable for browser-back in CLP
initBrowserBackEvent()

export const IcmaaExtendedCatalogModule: StorefrontModule = async ({ store, router }) => {
  extendStore('attribute', IcmaaExtendedAttributeStore)
  extendStore('category-next', IcmaaExtendedCategoryStore)
  extendStore('product', IcmaaExtendedProductStore)
  extendStore('breadcrumbs', IcmaaBreadcrumbsStore)
  store.registerModule(stateKey, SearchAliasStore)

  /**
   * Bugfix for missing price if the selected variant don't have specific price attributes.
   * This mutator event is added to core inside the `getSelectedVariant` method.
   * ---
   * If you switch between different configurable options, sometimes the options don't have a price value.
   * The selected variant then won't overwrite the option you choose before and the price wont change back.
   */
  icmaaCatalogHooks.afterSelectedVariant(({ product, selectedVariant }) => {
    if (selectedVariant && !selectedVariant.price_incl_tax) {
      const priceKeys = ['price', 'price_tax', 'price_incl_tax', 'original_price', 'original_price_tax', 'original_price_incl_tax']
      selectedVariant = Object.assign(selectedVariant, pick(product, priceKeys))
    }
    return selectedVariant
  })

  if (!isServer) {
    /**
     * Load our bunch of attributes asynchronly to prevent a huge state on load.
     * This is a memory-leak if it grows big and stuff like page-rendering and minifying will take forever.
     * ---
     * * We uncommented the original lines in `vue-storefront/core/modules/catalog/index.ts` to prevent original
     *   preloading and replace it by our, following routing.
     * * We also added `attribute.list_by_code` and `attribute.list_by_id` to the `ssr.initialStateFilter` config
     *   value to filter those from initial state json – these are massive JSON objects (like 55000 line extra).
     */
    if (!config.entities.attribute.loadByAttributeMetadata) {
      await store.dispatch('attribute/list', {
        filterValues: uniq([...products.defaultFilters, ...entities.productList.includeFields])
      })
    }

    router.beforeEach(async (to, from, next) => {
      if (store.getters['url/getPrevRouteDispatcher']?.name !== 'category' &&
        !(store.getters['url/getPrevRoute']?.name || '').endsWith('search')
      ) {
        routerHelper.popStateDetected = false
      }
      next()
    })
  }
}
