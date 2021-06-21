import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { ApmState } from 'icmaa-checkout-com/types'
import { Logger } from '@vue-storefront/core/lib/logger'
import i18n from '@vue-storefront/core/i18n'
import get from 'lodash-es/get'

const actions: ActionTree<ApmState, RootState> = {
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

    window.location.href = redirectUrl
  }
}

export default actions
