import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import Task from 'core/lib/sync/types/Task'
import { CartService as IcmaaCartService } from 'icmaa-cart/data-resolver/CartService'
import { Logger } from '@vue-storefront/core/lib/logger'
import { notifications } from 'icmaa-cart/helpers'

import omit from 'lodash-es/omit'

const actions: ActionTree<CartState, RootState> = {
  /**
   * Clone of originial `cart/syncTotals`
   *
   * Changes:
   * * Simplify data-structure and logic and make the object more readable
   * * Use this method to sync the whole quote and get the totals in return
   */
  async syncTotals ({ dispatch, getters, rootGetters }, { forceServerSync = false, methodsData }: { forceServerSync: boolean, methodsData?: any }) {
    if (getters.canSyncTotals && (getters.isTotalsSyncRequired || forceServerSync)) {
      const shippingDetails = Object.assign(
        { country_id: rootGetters['icmaaConfig/getCurrentStoreConfig'].tax.defaultCountry },
        rootGetters['checkout/getShippingDetails'] || { shippingMethod: false }
      )
      const { shippingMethod } = shippingDetails

      const addressDefaults = rootGetters['checkout/getAddressDefaults']
      let billingDetails = rootGetters['checkout/getPaymentDetails'] || { paymentMethod: false }
      billingDetails = Object.assign({}, addressDefaults, billingDetails)
      const { paymentMethod } = billingDetails

      const addressInformation = methodsData || {
        personalDetails: rootGetters['checkout/getPersonalDetails'],
        shippingAddress: omit(shippingDetails, ['shippingMethod']),
        billingAddress: omit(billingDetails, ['paymentMethod']),
        shippingMethod,
        paymentMethod
      }

      if (shippingDetails.country_id) {
        await dispatch('overrideServerTotals', {
          hasShippingInformation: shippingDetails.shippingMethod || false,
          addressInformation
        })
        return
      }

      Logger.error('Please do set the tax.defaultCountry in order to calculate totals', 'cart')()
    }
  },
  /**
   * Clone of originial `cart/getTotals`
   *
   * Changes:
   * * Use our custom service to have a more clean and readable quote-sync. Originally it's called totalSync but
   *   in fact we are setting all necessary informations for the whole quote and just respond the totals. Also
   *   there originally is a validation for the object that is passed which we don't need.
   * * Handle response if cart has been expired
   */
  async getTotals ({ dispatch }, { addressInformation, hasShippingInformation }) {
    let response: Task
    if (hasShippingInformation) {
      response = await IcmaaCartService.syncQuote(addressInformation)
    } else {
      response = await IcmaaCartService.getTotals()
    }

    if (response.code === 500) {
      const isKnownError = notifications.isKnownError(response.result)
      const logMessageType = isKnownError ? 'warn' : 'error'
      Logger[logMessageType]('Error while `cart/getTotals` action:', 'cart', response.result)()

      if (isKnownError) {
        await dispatch('clear', { sync: false })
          .then(() => { Logger.log('Cart has been cleared.', 'cart')() })
      }
    }

    return response
  }
}

export default actions
