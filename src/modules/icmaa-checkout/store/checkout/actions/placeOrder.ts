import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../../types/CheckoutState'
import { OrderService } from '../../../data-resolver/OrderService'
import { orderHooksExecutors } from '@vue-storefront/core/modules/order/hooks'
import { Logger } from '@vue-storefront/core/lib/logger'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import i18n from '@vue-storefront/i18n'

const actions: ActionTree<CheckoutState, RootState> = {
  async placeOrder ({ getters, dispatch }) {
    try {
      const payment = await dispatch('payment/beforePlaceOrder', getters.getPaymentMethodCode, { root: true })
      await orderHooksExecutors.beforePlaceOrder({ order: {}, task: { resultCode: 200 } })

      if (!payment) return false

      const response = await OrderService.placeOrder()

      if (response.resultCode && response.resultCode === 200 && !!response.result) {
        const paymentHandler = await dispatch(
          'payment/afterPlaceOrder',
          {
            code: getters.getPaymentMethodCode,
            payload: response.result.paymentData || response.result
          },
          { root: true }
        )

        console.error(paymentHandler)

        if (paymentHandler?.redirectUrl) {
          window.location.href = paymentHandler?.redirectUrl

          dispatch(
            'ui/loader',
            { active: true, message: i18n.t('Redirect to payment gateway') },
            { root: true }
          )

          return { redirectToPaymentGateway: true }
        }

        const order = { orderId: response.result.orderId, ...getters.getOrderData }
        orderHooksExecutors.afterPlaceOrder({ order, task: response })
        EventBus.$emit('checkout-after-place-order', { order, task: response })

        await dispatch('reset', {})

        if (order.createAccount) {
          dispatch(
            'ui/loader',
            { active: true, message: i18n.t('Login to your new account') },
            { root: true }
          )

          const { email: username, password } = order.personalDetails
          await dispatch('user/login', { username, password }, { root: true })
        }

        await dispatch('user/loadOrderByToken', { token: response.result.orderToken }, { root: true })

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
