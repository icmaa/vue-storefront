import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../../types/CheckoutState'
import { OrderService } from '@vue-storefront/core/data-resolver'
import { orderHooksExecutors } from '@vue-storefront/core/modules/order/hooks'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CheckoutState, RootState> = {
  async prepareOrderData ({ getters, rootGetters }) {
    // ... Add additional data we need here
    // Stuff like address and quote should already be saved in the quote
  },
  async placeOrder ({ dispatch, getters }) {
    try {
      /**
       * @todo Validate stock for cart items before anything is happening
       */

      await dispatch('payment/beforePlaceOrder', getters.getPaymentMethodCode, { root: true })

      let order = await dispatch('prepareOrderData')
      order = await orderHooksExecutors.beforePlaceOrder(order)

      const result = await OrderService.placeOrder(order)

      await dispatch('payment/afterPlaceOrder', getters.getPaymentMethodCode, { root: true })
      orderHooksExecutors.afterPlaceOrder({ order, task: result })

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
