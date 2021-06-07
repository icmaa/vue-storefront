import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { CardState } from 'icmaa-checkout-com/types'
import { CheckoutComService } from 'src/modules/icmaa-checkout-com/data-resolver/CheckoutComService'
import OrderState from '@vue-storefront/core/modules/order/types/OrderState'
import i18n from '@vue-storefront/core/i18n'
import get from 'lodash-es/get'

const actions: ActionTree<CardState, RootState> = {
  init () {
  },
  async save ({ dispatch, rootGetters, getters }) {
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
  beforePlaceOrder () {
  },
  async afterPlaceOrder ({ dispatch, rootGetters }) {
    const lastOrderResponse = rootGetters['checkout/getLastOrderResponse']
    if (!lastOrderResponse) {
      return console.error('Could not find last order')
    }

    const redirectUrl = get(lastOrderResponse, 'paymentData._links.redirect.href')

    if (!redirectUrl) {
      return dispatch('notification/spawnNotification', {
        type: 'error',
        message: i18n.t('Something went wrong. Payment was not successful.'),
        action1: { label: i18n.t('OK') }
      }, { root: true })
    }

    window.location.href = redirectUrl
  }
}

export default actions
