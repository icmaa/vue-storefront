import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import CheckoutState, { PersonalDetails } from '../../types/CheckoutState'

const mutations: MutationTree<CheckoutState> = {
  [types.CHECKOUT_SET_LOADING] (state, status) {
    state.loading = status
  },
  [types.CHECKOUT_SET_SECTIONS] (state, sections = {}) {
    state.sections = sections
  },
  [types.CHECKOUT_ACTIVATE_SECTION] (state, key) {
    let currentIndex = false
    for (let k in state.sections) {
      state.sections[k].active = false
      if (k === key) currentIndex = true
      state.sections[k].done = !currentIndex
    }

    state.sections[key].active = true
  },
  [types.CHECKOUT_SAVE_PERSONAL_DETAILS] (state, personalDetails) {
    state.personalDetails = personalDetails
  },
  [types.CHECKOUT_SAVE_SHIPPING_DETAILS] (state, shippingDetails) {
    state.shippingDetails = shippingDetails
  },
  [types.CHECKOUT_SAVE_SHIPPING_METHOD] (state, method) {
    state.shippingMethod = method
  },
  [types.CHECKOUT_SAVE_PAYMENT_DETAILS] (state, paymentDetails) {
    state.paymentDetails = paymentDetails
  },
  [types.CHECKOUT_SAVE_PAYMENT_METHOD] (state, method) {
    state.paymentMethod = method
  },
  [types.CHECKOUT_ADD_PAYMENT_METHOD] (state, paymentMethod) {
    state.paymentMethods.push(paymentMethod)
  },
  [types.CHECKOUT_SET_PAYMENT_METHODS] (state, paymentMethods = []) {
    state.paymentMethods = paymentMethods
  },
  [types.CHECKOUT_ADD_SHIPPING_METHOD] (state, shippingMethods) {
    state.shippingMethods.push(shippingMethods)
  },
  [types.CHECKOUT_SET_SHIPPING_METHODS] (state, shippingMethods = []) {
    state.shippingMethods = shippingMethods
  },
  [types.CHECKOUT_SET_PRIORITY_HANDLING] (state, payload) {
    state.priorityHandling = payload
  },
  [types.CHECKOUT_DROP_PASSWORD] (state) {
    state.personalDetails.password = ''
    state.personalDetails.createAccount = false
  }
}

export default mutations
