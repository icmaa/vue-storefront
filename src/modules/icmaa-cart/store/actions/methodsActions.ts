import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import PaymentMethod from '@vue-storefront/core/modules/cart/types/PaymentMethod'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { CartService } from '@vue-storefront/core/data-resolver'
import { CartService as IcmaaCartService } from 'icmaa-cart/data-resolver/CartService'
import { preparePaymentMethodsToSync } from '@vue-storefront/core/modules/cart/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

import omit from 'lodash-es/omit'

const actions: ActionTree<CartState, RootState> = {
  /**
   * Clone of originial `cart/syncShippingMethods`
   *
   * Changes:
   * * Use our object-key mapping from changes of `icmaa-checkout`
   * * Use our custom checkout data-resolver service to also attach the personal-details to the address.
   *   This way we can make this request more versataile and remove the validation in the original endpoint
   *   which might cause an error if we don't use their data-structure.
   */
  async syncShippingMethods ({ getters, rootGetters, dispatch }, { forceServerSync = false }) {
    if (getters.canUpdateMethods && (getters.isTotalsSyncRequired || forceServerSync)) {
      const personalDetails = rootGetters['checkout/getPersonalDetails']
      const addressDefaults = rootGetters['checkout/getAddressDefaults']
      const shippingDetails = Object.assign(
        {},
        addressDefaults,
        omit(rootGetters['checkout/getShippingDetails'], ['shippingMethod'])
      )

      Logger.debug('Refreshing shipping methods', 'cart', shippingDetails)()
      const { result } = await IcmaaCartService.getShippingMethods({ personalDetails, shippingDetails })
        .then(resp => {
          if (resp.resultCode === 500 && resp.result.error) {
            throw new Error(resp.result.message)
          }
          return resp
        })

      if (result !== false) {
        await dispatch('updateShippingMethods', { shippingMethods: result })
        return true
      }

      Logger.debug('Shipping methods request was empty', 'cart')()
    }

    Logger.debug('Shipping methods does not need to be updated', 'cart')()
    return true
  },
  /**
   * Clone of originial `cart/syncPaymentMethods`
   *
   * Changes:
   * * Change logic to only sync stuff we need: to get available payment-methods
   */
  async syncPaymentMethods ({ getters, rootGetters, dispatch }, { forceServerSync = false }) {
    if (getters.canUpdateMethods && (getters.isTotalsSyncRequired || forceServerSync)) {
      Logger.debug('Refreshing payment methods', 'cart')()

      const { result } = await CartService.getPaymentMethods()
      let backendPaymentMethods: PaymentMethod[] = result

      const { uniqueBackendMethods, paymentMethods } = preparePaymentMethodsToSync(
        backendPaymentMethods,
        rootGetters['checkout/getNotServerPaymentMethods']
      )

      await dispatch('checkout/replacePaymentMethods', paymentMethods, { root: true })

      EventBus.$emit('set-unique-payment-methods', uniqueBackendMethods)
    } else {
      Logger.debug('Payment methods does not need to be updated', 'cart')()
    }
  }
}

export default actions
