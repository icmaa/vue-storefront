import { Module } from 'vuex'
import { checkoutModule } from '@vue-storefront/core/modules/checkout/store/checkout'
import CheckoutState, { ExtendedCheckoutState, OverwriteCheckoutState } from '../../types/CheckoutState'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import merge from 'lodash-es/merge'

const extendedState: ExtendedCheckoutState = {
  loading: false,
  sections: {},
  agreements: []
}

const overwriteState: OverwriteCheckoutState = {
  shippingDetails: {},
  paymentDetails: {}
}

const state = Object.assign({}, checkoutModule.state, overwriteState)

export const IcmaaExtendedCheckoutStore: Module<CheckoutState, any> = {
  state: merge(state, extendedState),
  getters,
  actions,
  mutations
}
