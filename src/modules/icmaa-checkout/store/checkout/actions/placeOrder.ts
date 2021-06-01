import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../../types/CheckoutState'
import { Logger } from '@vue-storefront/core/lib/logger'

import omit from 'lodash-es/omit'

const actions: ActionTree<CheckoutState, RootState> = {
  async collectOrderData ({ getters, rootGetters }) {
    const billingDetails = getters.getPaymentDetails
    const { paymentMethod } = billingDetails || { paymentMethod: false }
    const shippingDetails = getters.getShippingDetails
    const { shippingMethod } = shippingDetails || { shippingMethod: false }

    const order: any = {
      user_id: rootGetters['user/getCustomer'] ? rootGetters['user/getCustomer'].id.toString() : '',
      cart_id: rootGetters['cart/getCartToken'] || '',
      products: rootGetters['cart/getCartItems'],
      addressInformation: {
        billingAddress: omit(billingDetails, ['paymentMethod']),
        shippingAddress: omit(shippingDetails, ['shippingMethod']),
        shipping_method_code: shippingMethod.method_code,
        shipping_carrier_code: shippingMethod.carrier_code,
        payment_method_code: paymentMethod.code,
        payment_method_additional: paymentMethod.additional_data
      }
    }

    return order
  },
  async placeOrder ({ dispatch, getters }) {
    try {
      /**
       * @todo Validate stock for cart items before anything is happening
       */

      await dispatch('payment/beforePlaceOrder', getters.getPaymentMethodCode, { root: true })

      const order = await dispatch('collectOrderData')
      const result = await dispatch('order/placeOrder', order, { root: true })

      await dispatch('payment/afterPlaceOrder', getters.getPaymentMethodCode, { root: true })

      if (!result.resultCode || result.resultCode === 200) {
        await dispatch('updateOrderTimestamp')
        await dispatch('cart/clear', { sync: false }, { root: true })
        await dispatch('dropPassword')
      }
    } catch (err) {
      Logger.error('Couldn\'t place order:', 'icmaa-checkout', err)()
    }
  }
}

export default actions
