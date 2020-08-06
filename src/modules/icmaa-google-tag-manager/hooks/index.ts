import { createListenerHook } from '@vue-storefront/core/lib/hooks'
import Product from '@vue-storefront/core/modules/catalog/types/Product'

const {
  hook: onGtmPageViewHook,
  executor: onGtmPageViewExecutor
} = createListenerHook<{ type: string, event: any }>()

const {
  hook: onSearchResultHook,
  executor: onSearchResultExecutor
} = createListenerHook<{ term: string, results: Product[] }>()

const IcmaaGoogleTagManagerExecutors = {
  onGtmPageView: onGtmPageViewExecutor,
  onSearchResult: onSearchResultExecutor
}

const IcmaaGoogleTagManager = {
  onGtmPageView: onGtmPageViewHook,
  onSearchResult: onSearchResultHook
}

export {
  IcmaaGoogleTagManager,
  IcmaaGoogleTagManagerExecutors
}
