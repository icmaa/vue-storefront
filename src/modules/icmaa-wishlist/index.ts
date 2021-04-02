import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore, isServer } from '@vue-storefront/core/helpers'

import { ExtendedWishlistStore } from './store'

export const IcmaaExtendedWishlistModule: StorefrontModule = async function ({ store }) {
  extendStore('wishlist', ExtendedWishlistStore)

  if (!isServer) {
    await store.dispatch('wishlist/load')
  }

  EventBus.$on('user-after-loggedin', () => {
    store.dispatch('wishlist/sync')
  })
}
