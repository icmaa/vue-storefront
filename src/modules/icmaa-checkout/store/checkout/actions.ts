import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../types/CheckoutState'
import placeOrderActions from './actions/placeOrder'
import checkoutActions from './actions/checkout'
import * as types from './mutation-types'

import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'

const actions: ActionTree<CheckoutState, RootState> = {
  loading ({ commit }, status = true) {
    commit(types.CHECKOUT_SET_LOADING, status)
  },
  setSections ({ commit }, sections) {
    commit(types.CHECKOUT_SET_SECTIONS, sections)
  },
  activateSection ({ commit, dispatch }, section) {
    dispatch('loading', false)
    commit(types.CHECKOUT_ACTIVATE_SECTION, section)

    IcmaaGoogleTagManagerExecutors.checkoutStep({ step: section })
  },
  ...checkoutActions,
  ...placeOrderActions
}

export default actions
