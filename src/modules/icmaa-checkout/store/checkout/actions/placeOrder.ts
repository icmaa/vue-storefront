import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../../types/CheckoutState'
import { OrderService } from '../../../data-resolver/OrderService'
import { orderHooksExecutors } from '@vue-storefront/core/modules/order/hooks'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CheckoutState, RootState> = {
  async placeOrder ({ getters, dispatch }) {
    try {
      await dispatch('payment/beforePlaceOrder', getters.getPaymentMethodCode, { root: true })
      await orderHooksExecutors.beforePlaceOrder({ order: {}, task: { resultCode: 200 } })

      const response = await OrderService.placeOrder()

      if (response.resultCode && response.resultCode === 200 && !!response.result) {
        await dispatch(
          'payment/afterPlaceOrder',
          {
            code: getters.getPaymentMethodCode,
            payload: response.result.paymentData || response.result
          },
          { root: true }
        )

        orderHooksExecutors.afterPlaceOrder({
          order: { id: response.result.orderId },
          task: response
        })

        dispatch('setLastOrderId', response.result.orderId)
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
