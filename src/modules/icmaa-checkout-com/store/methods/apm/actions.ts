import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { ApmState } from 'icmaa-checkout-com/types'
import { Logger } from '@vue-storefront/core/lib/logger'
import i18n from '@vue-storefront/core/i18n'
import get from 'lodash-es/get'

const actions: ActionTree<ApmState, RootState> = {
  async afterPlaceOrder ({ dispatch }, response) {
    if (!response || (!response._links && !response.paymentData)) {
      Logger.error('Could not find last order payment data:', 'icmaa-checkout-com', response)()
      return
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
