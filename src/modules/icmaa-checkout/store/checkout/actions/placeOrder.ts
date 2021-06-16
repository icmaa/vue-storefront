import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../../types/CheckoutState'
import * as types from '../mutation-types'
import { OrderService } from '../../../data-resolver/OrderService'
import { orderHooksExecutors } from '@vue-storefront/core/modules/order/hooks'
import { Logger } from '@vue-storefront/core/lib/logger'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import i18n from '@vue-storefront/i18n'

const actions: ActionTree<CheckoutState, RootState> = {
  setLastOrderToken ({ commit }, token) {
    commit(types.CHECKOUT_SET_LAST_ORDER_TOKEN, token)
  },
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

        const order = { orderId: response.result.orderId, ...getters.getOrderData }
        orderHooksExecutors.afterPlaceOrder({ order, task: response })
        EventBus.$emit('checkout-after-place-order', { order, task: response })

        dispatch('setLastOrderToken', response.result.orderToken)
        await dispatch('reset', {})

        if (order.createAccount) {
          dispatch(
            'ui/loader',
            { active: true, message: i18n.t('Login to your new account') }
          )

          const { email: username, password } = order.personalDetails
          await dispatch('user/login', { username, password }, { root: true })
        }

        return order
      } else {
        Logger.error('Couldn\'t place order:', 'icmaa-checkout', response.result)()
        return false
      }
    } catch (err) {
      Logger.error('Couldn\'t place order:', 'icmaa-checkout', err)()
      return false
    }
  }
}

export default actions
