import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { ApmState } from 'icmaa-checkout-com/types'
import { CheckoutComService } from 'icmaa-checkout-com/data-resolver/CheckoutComService'
import { SET_APM_LIST, SET_ERROR_MSG, SET_LOADING, SET_SELECTED_APM } from './mutation-types'
import { Logger } from '@vue-storefront/core/lib/logger'
import i18n from '@vue-storefront/core/i18n'
import get from 'lodash-es/get'

const actions: ActionTree<ApmState, RootState> = {
  select ({ commit, getters }, code) {
    const apm = getters.getApmList.find(item => item.id === code)
    if (apm) {
      commit(SET_SELECTED_APM, apm)
    } else {
      Logger.warn(`Apm with id ${code} not found`, 'checkout-com')()
    }
  },
  async loadApmList ({ commit }) {
    commit(SET_LOADING, true)
    const data = await CheckoutComService.getApmList()

    if (data.code === 200 && data.result.list) {
      commit(SET_APM_LIST, data.result.list)
    } else {
      Logger.error('Failed to load APM list', 'checkout-com')()
    }

    commit(SET_LOADING, false)
  },
  async init ({ dispatch }) {
    await dispatch('loadApmList')
  },
  async save ({ dispatch, rootGetters, getters, commit }) {
    if (!getters.getSelected.apm) {
      Logger.warn('Apm not selected', 'checkout-com')()
      commit(SET_ERROR_MSG, 'Please select a payment method')
      return false
    }

    const orderData = rootGetters['checkout/getOrderData'] || { paymentMethod: false }
    const paymentMethod = orderData.paymentMethod

    paymentMethod.additional_data = {
      apm: getters.getSelected.apm.id,
      ...(getters.getSelected.apm.data || {})
    }

    commit(SET_ERROR_MSG, undefined)

    await dispatch(
      'checkout/savePaymentDetails',
      Object.assign({}, rootGetters['checkout/getPaymentDetails'], { paymentMethod }),
      { root: true }
    )
  },
  beforePlaceOrder () {
  },
  async afterPlaceOrder ({ dispatch, rootGetters }, response) {
    console.log('response', response)
    if (!response || (!response._links && !response.paymentData)) {
      return console.error('Could not find last order payment data')
    }

    const redirectUrl = get(response, '_links.redirect.href') || get(response, 'paymentData._links.redirect.href')

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
