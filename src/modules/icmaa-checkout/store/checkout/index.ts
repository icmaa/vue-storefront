import { Module } from 'vuex'
import { checkoutModule } from '@vue-storefront/core/modules/checkout/store/checkout'
import CheckoutState, { ExtendedCheckoutState } from '../../types/CheckoutState'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import merge from 'lodash-es/merge'

const extendedState: ExtendedCheckoutState = {
  sections: {}
}

export const IcmaaExtendedCheckoutStore: Module<CheckoutState, any> = {
  state: merge(checkoutModule.state, extendedState),
  getters,
  actions,
  mutations
}
