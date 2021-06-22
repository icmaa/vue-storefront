import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { Logger } from '@vue-storefront/core/lib/logger'
import * as types from './store/checkout/mutation-types'

import { checkoutStore } from './store/checkout'
import moduleRoutes from './routes'

export const IcmaaCheckoutModule: StorefrontModule = function ({ store, router, appConfig }) {
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
  store.registerModule('checkout', checkoutStore)

  StorageManager.init('checkout')

  store.subscribe((mutation, state) => {
    const type = mutation.type

    const setStorage = (key: string, value: any): Promise<any> => StorageManager.get('checkout')
      .setItem(key, value)
      .catch(reason => { Logger.error(reason)() })

    if (type.endsWith(types.CHECKOUT_SAVE_PERSONAL_DETAILS)) {
      setStorage('personal-details', state.checkout.personalDetails)
    }

    if (type.endsWith(types.CHECKOUT_SAVE_SHIPPING_DETAILS)) {
      setStorage('shipping-details', state.checkout.shippingDetails)
    }

    if (type.endsWith(types.CHECKOUT_SAVE_SHIPPING_METHOD)) {
      setStorage('shipping-method', state.checkout.shippingMethod)
    }

    if (type.endsWith(types.CHECKOUT_SAVE_PAYMENT_DETAILS)) {
      setStorage('payment-details', state.checkout.paymentDetails)
    }

    if (type.endsWith(types.CHECKOUT_SAVE_PAYMENT_METHOD)) {
      setStorage('payment-method', state.checkout.paymentMethod)
    }

    if (type.endsWith(types.CHECKOUT_SET_GATEWAY_ORDER)) {
      setStorage('gateway-order', state.checkout.gatewayOrder)
    }
  })
}
