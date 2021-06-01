import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { Logger } from '@vue-storefront/core/lib/logger'
import * as types from './store/checkout/mutation-types'

import { checkoutStore } from './store/checkout'
import moduleRoutes from './routes'

export const IcmaaCheckoutModule: StorefrontModule = function ({ store, router, appConfig }) {
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)

  StorageManager.init('checkout')
  store.registerModule('checkout', checkoutStore)

  store.subscribe((mutation, state) => {
    const type = mutation.type

    if (
      type.endsWith(types.CHECKOUT_SAVE_PERSONAL_DETAILS)
    ) {
      StorageManager.get('checkout').setItem('personal-details', state.checkout.personalDetails).catch((reason) => {
        Logger.error(reason)()
      })
    }

    if (
      type.endsWith(types.CHECKOUT_SAVE_SHIPPING_DETAILS)
    ) {
      StorageManager.get('checkout').setItem('shipping-details', state.checkout.shippingDetails).catch((reason) => {
        Logger.error(reason)()
      })
    }

    if (
      type.endsWith(types.CHECKOUT_SAVE_PAYMENT_DETAILS)
    ) {
      StorageManager.get('checkout').setItem('payment-details', state.checkout.paymentDetails).catch((reason) => {
        Logger.error(reason)()
      })
    }
  })
}
