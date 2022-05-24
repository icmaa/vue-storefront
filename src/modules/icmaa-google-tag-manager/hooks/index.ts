import { createListenerHook } from '@vue-storefront/core/lib/hooks'
import Product from '@vue-storefront/core/modules/catalog/types/Product'
import { Category } from 'core/modules/catalog-next/types/Category'
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
  hook: pageNotFoundHook,
  executor: pageNotFoundExecutor
} = createListenerHook<void>()

const {
  hook: onSearchResultHook,
  executor: onSearchResultExecutor
} = createListenerHook<{ term: string, results: Product[] }>()

const {
  hook: onSearchPanelCategoryClickHook,
  executor: onSearchPanelCategoryClickExecutor
} = createListenerHook<{ category: Category }>()

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
  hook: wishlistInteractionHook,
  executor: wishlistInteractionExecutor
} = createListenerHook<{ type: 'add'|'rmv', product: Product }>()

const {
  hook: facebookLoginClickedHook,
  executor: facebookLoginClickedExecutor
} = createListenerHook<{ status: string }>()

const {
  hook: checkoutVisitedHook,
  executor: checkoutVisitedExecutor
} = createListenerHook()

const {
  hook: checkoutStepHook,
  executor: checkoutStepExecutor
} = createListenerHook<{ step: string, data?: any }>()

const IcmaaGoogleTagManagerExecutors = {
  afterEach: afterEachExecutor,
  pageNotFound: pageNotFoundExecutor,
  onGtmPageView: onGtmPageViewExecutor,
  onSearchResult: onSearchResultExecutor,
  onSearchPanelCategoryClick: onSearchPanelCategoryClickExecutor,
  searchResultVisited: searchResultVisitedExecutor,
  openProductListFilterSidebar: openProductListFilterSidebarExecutor,
  onProductListFilter: onProductListFilterExecutor,
  removeProductFromCart: removeProductFromCartExecutor,
  wishlistInteraction: wishlistInteractionExecutor,
  facebookLoginClicked: facebookLoginClickedExecutor,
  checkoutVisited: checkoutVisitedExecutor,
  checkoutStep: checkoutStepExecutor
}

const IcmaaGoogleTagManager = {
  afterEach: afterEachHook,
  pageNotFound: pageNotFoundHook,
  onGtmPageView: onGtmPageViewHook,
  onSearchResult: onSearchResultHook,
  onSearchPanelCategoryClick: onSearchPanelCategoryClickHook,
  searchResultVisited: searchResultVisitedHook,
  openProductListFilterSidebar: openProductListFilterSidebarHook,
  onProductListFilter: onProductListFilterHook,
  removeProductFromCart: removeProductFromCartHook,
  wishlistInteraction: wishlistInteractionHook,
  facebookLoginClicked: facebookLoginClickedHook,
  checkoutVisited: checkoutVisitedHook,
  checkoutStep: checkoutStepHook
}

export {
  IcmaaGoogleTagManager,
  IcmaaGoogleTagManagerExecutors
}
