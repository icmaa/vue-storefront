import { Module } from 'vuex'
import config from 'config'
import CheckoutState from '../../types/CheckoutState'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  loading: false,
  sections: {},
  personalDetails: {
    email: '',
    firstname: '',
    lastname: '',
    gender: '',
    dob: '',
    password: '',
    createAccount: false
  },
  shippingDetails: {},
  shippingMethod: {},
  paymentDetails: {},
  paymentMethod: {},
  shippingMethods: config.shipping.methods || [],
  paymentMethods: [],
  priorityHandling: null,
  lastOrderId: null
}

export const checkoutStore: Module<CheckoutState, any> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
