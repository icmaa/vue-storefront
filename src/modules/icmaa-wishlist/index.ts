import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore } from '@vue-storefront/core/helpers'

import { ExtendedWishlistStore } from './store'

export const IcmaaExtendedWishlistModule: StorefrontModule = async function ({ store, router }) {
  extendStore('wishlist', ExtendedWishlistStore)
  EventBus.$on('user-after-loggedin', () => {
    // store.dispatch('user/setSessionGenderByCustomerData')
  })
}
