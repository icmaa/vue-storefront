import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { CardState } from 'icmaa-checkout-com/types'
import { Logger } from '@vue-storefront/core/lib/logger'
import i18n from '@vue-storefront/core/i18n'
import get from 'lodash-es/get'

const actions: ActionTree<CardState, RootState> = {
  async save ({ dispatch, rootGetters, getters }) {
    const orderData = rootGetters['checkout/getOrderData'] || { paymentMethod: false }
    const paymentMethod = orderData.paymentMethod

    if (!getters.getToken) {
      return false
    }

    paymentMethod.additional_data = {
      cardToken: getters.getToken
    }

    await dispatch(
      'checkout/savePaymentMethod',
      paymentMethod,
      { root: true }
    )
  },
  async afterPlaceOrder ({ dispatch }, response) {
    if (!response || !response._links) {
      Logger.error('Could not find payment data for last order', 'icmaa-checkout-com')()
      return false
    }

    const redirectUrl = get(response, '_links.redirect.href')

    if (!redirectUrl) {
      dispatch('notification/spawnNotification', {
        type: 'error',
        message: i18n.t('Something went wrong. Payment was not successful.'),
        action1: { label: i18n.t('OK') }
      }, { root: true })

      return false
    }

    return { redirectUrl }
  }
}

export default actions
