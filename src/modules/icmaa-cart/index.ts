import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore } from '@vue-storefront/core/helpers'
import { cartHooks } from '@vue-storefront/core/modules/cart/hooks'

import { IcmaaExtendedCartStore } from './store'

export const IcmaaExtendedCartModule: StorefrontModule = function ({ store }) {
  extendStore('cart', IcmaaExtendedCartStore)

  cartHooks.beforeSync(async data => {
    store.dispatch('cart/updateFreeCartItems', data.serverItems)
    return data
  })

  cartHooks.afterRemoveFromCart(async data => {
    if (store.getters['cart/getFreeCartItems']?.length > 0) {
      store.dispatch('cart/couponCallback')
    }
    return data
  })
}
