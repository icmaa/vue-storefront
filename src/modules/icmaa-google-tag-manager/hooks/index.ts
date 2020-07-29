import { createListenerHook } from '@vue-storefront/core/lib/hooks'
import Product from '@vue-storefront/core/modules/catalog/types/Product'

const {
  hook: onSearchResultHook,
  executor: onSearchResultExecutor
} = createListenerHook<{ term: string, results: Product[] }>()

const IcmaaGoogleTagManagerExecutors = {
  onSearchResult: onSearchResultExecutor
}

const IcmaaGoogleTagManager = {
  onSearchResult: onSearchResultHook
}

export {
  IcmaaGoogleTagManager,
  IcmaaGoogleTagManagerExecutors
}
