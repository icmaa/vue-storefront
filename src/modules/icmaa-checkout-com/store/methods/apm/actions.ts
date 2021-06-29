import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { ApmState } from 'icmaa-checkout-com/types'
import { Logger } from '@vue-storefront/core/lib/logger'
import i18n from '@vue-storefront/core/i18n'
import get from 'lodash-es/get'
import { SET_ADDITIONAL_DATA, SET_VALIDATIONS } from './mutation-types'
import { icmaa_checkoutcom } from 'config'

const actions: ActionTree<ApmState, RootState> = {
  setAdditionalInformation ({ commit, rootGetters }, data) {
    if (icmaa_checkoutcom.sandbox) {
      const storeCode = rootGetters['icmaaConfig/getCurrentStore'].storeCode
      data.baseUrl = `${location.origin}/${storeCode}/`
    }

    commit(SET_ADDITIONAL_DATA, data)
  },
  setValidations ({ commit }, data) {
    commit(SET_VALIDATIONS, data)
  },
  async save ({ dispatch, rootGetters, getters }) {
    if (getters.getValidations) {
      getters.getValidations.$touch()

      if (getters.getValidations.$invalid) {
        return false
      }
    }

    const paymentMethodCode = rootGetters['checkout/getPaymentMethodCode']
    if (paymentMethodCode === 'checkoutcom_apm_klarna') {
      await dispatch('authorizeKlarnaTransaction')
    }

    if (!getters.getAdditionalData) {
      return true
    }

    const paymentMethod = rootGetters['checkout/getPaymentMethod']
    paymentMethod.additional_data = getters.getAdditionalData

    await dispatch(
      'checkout/savePaymentMethod',
      paymentMethod,
      { root: true }
    )
  },
  async afterPlaceOrder ({ dispatch, rootGetters }, response) {
    if (!response || !response._links) {
      Logger.error('Could not find payment data for last order', 'icmaa-checkout-com')()
      return false
    }

    const redirectUrl = get(response, '_links.redirect.href')
    if (!redirectUrl) {
      // SEPA & Klarna don't need a redirect
      const paymentMethodCode = rootGetters['checkout/getPaymentMethodCode']
      const methodsWithoutCapture = [ 'checkoutcom_apm_sepa', 'checkoutcom_apm_klarna' ]
      if (methodsWithoutCapture.includes(paymentMethodCode)) {
        return false
      }

      dispatch('notification/spawnNotification', {
        type: 'error',
        message: i18n.t('Something went wrong. Payment was not successful.'),
        action1: { label: i18n.t('OK') }
      }, { root: true })

      return false
    }

    return { redirectUrl }
  },
  async authorizeKlarnaTransaction ({ dispatch }) {
    return new Promise<void>(resolve => {
      try {
        (window as any).Klarna.Payments.authorize(
          { instance_id: 'icmaa-klarna-payments-instance' },
          {},
          resp => {
            dispatch('setAdditionalInformation', resp)
            resolve()
          }
        )
      } catch (err) {
        Logger.error('Couldn\'t authorize Klarna payment', 'icmaa-checkout-com', err)()
        resolve()
      }
    })
  }
}

export default actions
