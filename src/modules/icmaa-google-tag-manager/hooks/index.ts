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
  hook: searchResultVisitedHook,
  executor: searchResultVisitedExecutor
} = createListenerHook<{ term: string, results: Product[] }>()

const {
  hook: openProductListFilterSidebarHook,
  executor: openProductListFilterSidebarExecutor
} = createListenerHook()

const {
  hook: onProductListFilterHook,
  executor: onProductListFilterExecutor
} = createListenerHook<{ filter: any }>()

const {
  hook: removeProductFromCartHook,
  executor: removeProductFromCartExecutor
} = createListenerHook<{ product: Product }>()

const {
  hook: facebookLoginClickedHook,
  executor: facebookLoginClickedExecutor
} = createListenerHook<{ status: string }>()

const IcmaaGoogleTagManagerExecutors = {
  afterEach: afterEachExecutor,
  onGtmPageView: onGtmPageViewExecutor,
  onSearchResult: onSearchResultExecutor,
  searchResultVisited: searchResultVisitedExecutor,
  openProductListFilterSidebar: openProductListFilterSidebarExecutor,
  onProductListFilter: onProductListFilterExecutor,
  removeProductFromCart: removeProductFromCartExecutor,
  facebookLoginClicked: facebookLoginClickedExecutor
}

const IcmaaGoogleTagManager = {
  afterEach: afterEachHook,
  onGtmPageView: onGtmPageViewHook,
  onSearchResult: onSearchResultHook,
  searchResultVisited: searchResultVisitedHook,
  openProductListFilterSidebar: openProductListFilterSidebarHook,
  onProductListFilter: onProductListFilterHook,
  removeProductFromCart: removeProductFromCartHook,
  facebookLoginClicked: facebookLoginClickedHook
}

export {
  IcmaaGoogleTagManager,
  IcmaaGoogleTagManagerExecutors
}
