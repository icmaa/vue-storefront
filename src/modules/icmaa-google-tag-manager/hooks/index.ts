import { createListenerHook } from '@vue-storefront/core/lib/hooks'
import Product from '@vue-storefront/core/modules/catalog/types/Product'
import { Route } from 'vue-router'

const {
  hook: afterEachHook,
  executor: afterEachExecutor
} = createListenerHook<{ to: Route, from?: Route }>()

const {
  hook: onGtmPageViewHook,
  executor: onGtmPageViewExecutor
} = createListenerHook<{ type: string, event: any }>()

const {
  hook: onSearchResultHook,
  executor: onSearchResultExecutor
} = createListenerHook<{ term: string, results: Product[] }>()

const {
  hook: openProductListFilterSidebarHook,
  executor: openProductListFilterSidebarExecutor
} = createListenerHook()

const {
  hook: onProductListFilterHook,
  executor: onProductListFilterExecutor
} = createListenerHook<{ filter: any }>()

const IcmaaGoogleTagManagerExecutors = {
  afterEach: afterEachExecutor,
  onGtmPageView: onGtmPageViewExecutor,
  onSearchResult: onSearchResultExecutor,
  openProductListFilterSidebar: openProductListFilterSidebarExecutor,
  onProductListFilter: onProductListFilterExecutor
}

const IcmaaGoogleTagManager = {
  afterEach: afterEachHook,
  onGtmPageView: onGtmPageViewHook,
  onSearchResult: onSearchResultHook,
  openProductListFilterSidebar: openProductListFilterSidebarHook,
  onProductListFilter: onProductListFilterHook
}

export {
  IcmaaGoogleTagManager,
  IcmaaGoogleTagManagerExecutors
}
