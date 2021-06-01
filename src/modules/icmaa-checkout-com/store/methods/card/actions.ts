import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { CardState } from 'icmaa-checkout-com/types'
import { CheckoutComService } from 'src/modules/icmaa-checkout-com/data-resolver/CheckoutComService'
import OrderState from '@vue-storefront/core/modules/order/types/OrderState'
import i18n from '@vue-storefront/core/i18n'

const actions: ActionTree<CardState, RootState> = {
  init () {
  },
  save () {
  },
  async beforePlaceOrder ({ dispatch, rootGetters, getters }) {
    const paymentDetails = rootGetters['checkout/getPaymentDetails'] || { paymentMethod: false }
    const paymentMethod = paymentDetails.paymentMethod

    paymentMethod.additional_data = {
      cardToken: getters.getToken
    }

    await dispatch(
      'checkout/savePaymentDetails',
      Object.assign({}, rootGetters['checkout/getPaymentDetails'], { paymentMethod }),
      { root: true }
    )
  },
  async afterPlaceOrder ({ dispatch, getters, rootState }) {
    const lastOrder = (rootState as RootState & { order: OrderState }).order.last_order_confirmation

    if (!lastOrder) {
      return console.error('Could not find last order')
    }

    const paymentDetails = await CheckoutComService.getPaymentDetails(
      getters.getToken,
      lastOrder.confirmation.magentoOrderId
    )

    if (paymentDetails.result && paymentDetails.result.success === true) {
      window.location.href = paymentDetails.result.url
    } else {
      dispatch('notification/spawnNotification', {
        type: 'error',
        message: i18n.t('Payment was not successful.'),
        action1: { label: i18n.t('OK') }
      }, { root: true })
    }
  }
}

export default actions
