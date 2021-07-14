import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { CardState } from 'icmaa-checkout-com/types'
import { Logger } from '@vue-storefront/core/lib/logger'
import { icmaa_checkoutcom } from 'config'
import * as types from './mutation-types'
import i18n from '@vue-storefront/core/i18n'
import get from 'lodash-es/get'

declare const Frames: any

const actions: ActionTree<CardState, RootState> = {
  setToken ({ commit }, token) {
    commit(types.SET_TOKEN, token)
  },
  setValidations ({ commit }, data) {
    commit(types.SET_VALIDATIONS, data)
  },
  async save ({ dispatch, rootGetters, getters }) {
    if (getters.getValidations) {
      getters.getValidations.$touch()

      if (getters.getValidations.$invalid) {
        return false
      }
    }

    const paymentMethod = rootGetters['checkout/getPaymentMethod']

    await Frames
      .submitCard()
      .catch(e => {
        Logger.error('Couldn\'t fetch token for CC', 'icmaa-checkout-com', e)()
      })

    const cardToken = getters.getToken
    if (!cardToken) {
      return false
    }

    paymentMethod.additional_data = { cardToken }

    if (icmaa_checkoutcom.sandbox) {
      const storeCode = rootGetters['icmaaConfig/getCurrentStore'].storeCode
      paymentMethod.additional_data.baseUrl = `${location.origin}/${storeCode}/`
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
