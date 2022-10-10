import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { cartStore } from './store'
import { cartCacheHandlerPlugin } from './helpers'
import { isServer } from '@vue-storefront/core/helpers'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

export const CartModule: StorefrontModule = function ({ store }) {
  StorageManager.init('cart', undefined, 512)

  store.registerModule('cart', cartStore)

  if (!isServer) store.dispatch('cart/load')
  store.subscribe(cartCacheHandlerPlugin)
}
