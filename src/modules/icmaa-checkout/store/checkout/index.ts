import { Module } from 'vuex'
import CheckoutState from '../../types/CheckoutState'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  loading: false,
  sections: {},
  personalDetails: null,
  shippingDetails: null,
  shippingMethod: null,
  paymentDetails: null,
  paymentMethod: null,
  shippingMethods: [],
  paymentMethods: [],
  priorityHandling: null
}

export const checkoutStore: Module<CheckoutState, any> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
