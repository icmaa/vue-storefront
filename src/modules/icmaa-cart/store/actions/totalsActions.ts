import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import Task from 'core/lib/sync/types/Task'
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import { prepareShippingInfoForUpdateTotals } from '@vue-storefront/core/modules/cart/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { CartService as IcmaaCartService } from 'icmaa-cart/data-resolver/CartService'
import { notifications } from 'icmaa-cart/helpers'

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
      const addressDefaults = rootGetters['checkout/getAddressDefaults']

      let shippingAddress = rootGetters['checkout/getShippingDetails']
      shippingAddress = Object.assign({}, addressDefaults, shippingAddress)

      let billingAddress = rootGetters['checkout/getPaymentDetails']
      billingAddress = Object.assign({}, addressDefaults, billingAddress)

      const personalDetails = rootGetters['checkout/getPersonalDetails']
      const shippingMethod = rootGetters['checkout/getShippingMethod']
      const paymentMethod = rootGetters['checkout/getPaymentMethod']

      const addressInformation = methodsData || {
        personalDetails,
        shippingAddress,
        billingAddress,
        shippingMethod,
        paymentMethod
      }

      if (shippingAddress.country_id) {
        return dispatch('overrideServerTotals', {
          hasShippingInformation: shippingMethod || false,
          addressInformation
        })
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
  },
  /**
   * Clone of originial `cart/overrideServerTotals`
   *
   * Changes:
   * * Return data or throw an error to be able to handle the result in a dispatch
   */
  async overrideServerTotals ({ commit, getters, dispatch }, { addressInformation, hasShippingInformation }) {
    const getTotalsTask = await dispatch('getTotals', { addressInformation, hasShippingInformation })
    const { resultCode, result } = getTotalsTask

    if (resultCode === 200) {
      const totals = result.totals || result
      Logger.log('Overriding server totals. ', 'cart', totals)()
      const itemsAfterTotal = prepareShippingInfoForUpdateTotals(totals.items)

      for (let key of Object.keys(itemsAfterTotal)) {
        const item = itemsAfterTotal[key]
        const product = { server_item_id: item.item_id, totals: item, qty: item.qty }
        await dispatch('updateItem', { product })
      }

      commit(types.CART_UPD_TOTALS, { itemsAfterTotal, totals, platformTotalSegments: totals.total_segments })
      commit(types.CART_SET_TOTALS_SYNC)

      // we received payment methods as a result of this call, updating state
      if (result.payment_methods && getters.canUpdateMethods) {
        const paymentMethods = result.payment_methods.map(method => ({ ...method, is_server_method: true }))
        dispatch('checkout/replacePaymentMethods', paymentMethods, { root: true })
      }

      return { resultCode, result }
    }

    Logger.error('Error during "overrideServerTotals" action: ', 'cart', result)()
    throw Error(result)
  }
}

export default actions
