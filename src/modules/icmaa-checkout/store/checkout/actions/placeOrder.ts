import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../../types/CheckoutState'
import { OrderService } from '../../../data-resolver/OrderService'
import { orderHooksExecutors } from '@vue-storefront/core/modules/order/hooks'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CheckoutState, RootState> = {
  async prepareOrderData ({ getters, rootGetters }) {
    // ... Add additional data we need here
    // Stuff like address and quote should already be saved in the quote
  },
  async placeOrder ({ getters, dispatch }) {
    try {
      /**
       * @todo Validate stock for cart items before anything is happening
       */

      await dispatch('payment/beforePlaceOrder', getters.getPaymentMethodCode, { root: true })

      let order = await dispatch('prepareOrderData')
      order = await orderHooksExecutors.beforePlaceOrder(order)

      const response = await OrderService.placeOrder(order)

      await dispatch('payment/afterPlaceOrder', getters.getPaymentMethodCode, { root: true })
      orderHooksExecutors.afterPlaceOrder({ order, task: response })

      if (!response.resultCode || response.resultCode === 200) {
        dispatch('setLastOrderId', response.result)
        await dispatch('reset', {})
      } else {
        Logger.error('Couldn\'t place order:', 'icmaa-checkout', response.result)()
        return false
      }

      return response
    } catch (err) {
      Logger.error('Couldn\'t place order:', 'icmaa-checkout', err)()
      return false
    }
  }
}

export default actions
